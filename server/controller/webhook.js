import Stripe from "stripe";
import { Transaction } from "../models/transaction.model.js";
import { User } from "../models/user.model.js";

export const stripeWebhook = async (request, response) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = request.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log("❌ Webhook signature error:", error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("✅ PaymentIntent succeeded:", paymentIntent.id);

        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
          limit: 1,
        });

        const session = sessionList.data[0];
        if (!session) throw new Error("Session not found");

        console.log("📌 Session metadata:", session.metadata);

        const { transactionId, appId } = session.metadata;
        if (appId === "quickgpt") {
          const transaction = await Transaction.findOne({
            _id: transactionId,
            isPaid: false,
          });
          if (!transaction)
            throw new Error("Transaction not found or already paid");

          console.log("📌 Transaction found:", transaction);

          // update user credits
          await User.updateOne(
            { _id: transaction.userId },
            { $inc: { credits: transaction.credits } }
          );

          // mark transaction as paid
          transaction.isPaid = true;
          await transaction.save();

          console.log("🎉 Credits updated successfully!");
        } else {
          console.log("⚠️ Invalid appId:", appId);
          return response.json({
            received: true,
            message: "invalid app id",
          });
        }
        break;
      }

      default:
        console.log(`⚠️ Unhandled event type ${event.type}`);
        break;
    }

    response.json({ received: true });
  } catch (error) {
    console.log("❌ Webhook error:", error);
    return response.status(500).send(`Webhook Error: ${error.message}`);
  }
};
