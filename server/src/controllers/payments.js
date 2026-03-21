const stripe = require("../config/stripe");
const ordersRepo = require("../repo/orders");
const supabase = require("../config/db");

async function createPaymentIntent(req, res, next) {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    const order = await ordersRepo.getOrderByIdForInvoice(orderId, userId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({ message: "Cannot pay a cancelled order" });
    }

    if (order.payment_status === "paid") {
      return res.status(400).json({ message: "Order is already paid" });
    }

    const amount = Math.round(Number(order.total) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "ron",
      metadata: {
        order_id: order.id,
        user_id: userId,
        invoice_number: order.invoice_number || "",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        stripe_payment_intent_id: paymentIntent.id,
      })
      .eq("id", order.id)
      .eq("user_id", userId);

    if (updateError) throw updateError;

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    next(error);
  }
}

async function confirmOrderPayment(req, res, next) {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    const order = await ordersRepo.getOrderByIdForInvoice(orderId, userId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.stripe_payment_intent_id) {
      return res
        .status(400)
        .json({ message: "Payment intent not found for this order" });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      order.stripe_payment_intent_id,
    );

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment is not completed" });
    }

    const { data, error } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        paid_at: new Date().toISOString(),
        status: "confirmed",
      })
      .eq("id", order.id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPaymentIntent,
  confirmOrderPayment,
};
