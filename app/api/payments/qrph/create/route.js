import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getPayMongoHeaders } from "@/lib/paymongo";

export async function POST(req) {
  try {
    const body = await req.json();

    const { userId, storeId, addressId, total } = body;

    // 🟡 STEP 1: CREATE ORDER FIRST
    const order = await prisma.order.create({
      data: {
        userId,
        storeId,
        addressId,
        total,
        paymentMethod: "QRPH",
        status: "PAYMENT_PENDING",
      },
    });

    // 🟡 STEP 2: CREATE PAYMENT INTENT
    const paymentIntentResponse = await fetch(
      "https://api.paymongo.com/v1/payment_intents",
      {
        method: "POST",
        headers: getPayMongoHeaders(),
        body: JSON.stringify({
          data: {
            attributes: {
              amount: Math.round(total * 100),
              currency: "PHP",
              payment_method_allowed: ["qrph"],
              description: "Order " + order.id,
            },
          },
        }),
      },
    );

    const paymentIntent = await paymentIntentResponse.json();

    console.log("PAYMONGO RESPONSE:", paymentIntent);

    // 🔥 HARD STOP IF INVALID
    if (!paymentIntent?.data?.id) {
      throw new Error("Payment Intent creation failed");
    }

    // 🔥 GUARANTEED SAVE
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymongoReference: paymentIntent.data.id,
      },
    });

    console.log("SAVED PAYMENT INTENT:", paymentIntent.data.id);

    // 🟡 STEP 4: CREATE PAYMENT METHOD
    const paymentMethodResponse = await fetch(
      "https://api.paymongo.com/v1/payment_methods",
      {
        method: "POST",
        headers: getPayMongoHeaders(),
        body: JSON.stringify({
          data: {
            attributes: {
              type: "qrph",
            },
          },
        }),
      },
    );

    const paymentMethod = await paymentMethodResponse.json();

    // 🟡 STEP 5: ATTACH PAYMENT METHOD
    const attachResponse = await fetch(
      `https://api.paymongo.com/v1/payment_intents/${paymentIntent.data.id}/attach`,
      {
        method: "POST",
        headers: getPayMongoHeaders(),
        body: JSON.stringify({
          data: {
            attributes: {
              payment_method: paymentMethod.data.id,
              client_key: paymentIntent.data.attributes.client_key,
            },
          },
        }),
      },
    );

    const attachedPayment = await attachResponse.json();

    // 🟢 STEP 6: RETURN TO FRONTEND
    return NextResponse.json({
      orderId: order.id,
      payment: attachedPayment,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
