import Stripe from "stripe";
import { Transaction } from "../models/transaction.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const plans = [
  {
    _id: "basic",
    name: "Basic",
    price: 10,
    credits: 100,
    features: [
      "100 text generations",
      "50 image generations",
      "Standard support",
      "Access to basic models",
    ],
  },
  {
    _id: "pro",
    name: "Pro",
    price: 20,
    credits: 500,
    features: [
      "500 text generations",
      "200 image generations",
      "Priority support",
      "Access to pro models",
      "Faster response time",
    ],
  },
  {
    _id: "premium",
    name: "Premium",
    price: 30,
    credits: 1000,
    features: [
      "1000 text generations",
      "500 image generations",
      "24/7 VIP support",
      "Access to premium models",
      "Dedicated account manager",
    ],
  },
];

// ✅ Get plans
export const getPlans = async (req, res) => {
  try {
    res.json({ success: true, plans });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "something went wrong", error });
  }
};

// ✅ Purchase plan
export const purchasePlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { planId } = req.body;
    const plan = plans.find((p) => p._id === planId);

    if (!plan) {
      return res.json({ success: false, message: "invalid plan" });
    }

    // create new transaction
    const transaction = await Transaction.create({
      userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false,
    });

    const { origin } = req.headers;

    // create stripe session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: plan.price * 100,
            product_data: {
              name: `${plan.name} Plan`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/loading`,
      cancel_url: `${origin}`,
      metadata: {
        transactionId: transaction._id.toString(),
        appId: "quickgpt", // مهم هنا يتطابق مع webhook
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
    });

    res.json({
      success: true,
      message: "checkout session created",
      url: session.url,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "something went wrong", error });
  }
};
