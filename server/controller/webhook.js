import Stripe from "stripe";
import { Transaction } from "../models/transaction.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET // ✅ تصحيح هنا
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessionList.data[0];
        if (!session) {
          console.log("⚠️ No session found for payment_intent:", paymentIntent.id);
          break;
        }

        const { transactionId, appId } = session.metadata || {};

        if (appId === "quickgpt") {
          const transaction = await Transaction.findOne({
            _id: transactionId,
            isPaid: false,
          });

          if (!transaction) {
            console.log("⚠️ Transaction not found or already paid:", transactionId);
            break;
          }

          await User.updateOne(
            { _id: transaction.userId },
            { $inc: { credits: transaction.credits } }
          );

          transaction.isPaid = true;
          await transaction.save();

          console.log(
            `✅ User ${transaction.userId} credited with ${transaction.credits}`
          );
        } else {
          return res.json({ received: true, message: "invalid app id" });
        }

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res
      .status(500)
      .json({ error: { code: "500", message: "A server error has occurred" } });
  }
};
