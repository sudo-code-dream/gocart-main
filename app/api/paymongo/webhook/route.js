import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("WEBHOOK RECEIVED:", JSON.stringify(body, null, 2));

    // ✅ CORRECT PAYMONGO PAYMENT INTENT ID

    const paymentIntentId =
      body.data.attributes.data.attributes.payment_intent_id;

    if (!paymentIntentId) {
      return new Response("No paymentIntentId", { status: 200 });
    }

    // 🔥 FIND ORDER
    const order = await prisma.order.findFirst({
      where: {
        paymongoReference: paymentIntentId,
      },
    });

    if (!order) {
      console.log("ORDER NOT FOUND:", paymentIntentId);
      return new Response("Order not found", { status: 200 });
    }

    // 🟢 STEP 3: Update order
    await prisma.order.update({
      where: { id: order.id },
      data: {
        isPaid: true,
        status: "ORDER_PLACED",
      },
    });

    console.log("PAYMENT INTENT ID:", paymentIntentId);
    console.log("ORDER UPDATED SUCCESSFULLY");

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook failed", { status: 500 });
  }
}
