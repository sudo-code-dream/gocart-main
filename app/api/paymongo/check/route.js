import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 },
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const response = await fetch(
      `https://api.paymongo.com/v1/payment_intents/${order.paymongoReference}`,
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString(
              "base64",
            ),
          "Content-Type": "application/json",
        },
      },
    );

    const paymentIntent = await response.json();

    return NextResponse.json({
      isPaid: order.isPaid,
      status: order.status,
      testUrl:
        paymentIntent.data?.attributes?.next_action?.code?.test_url || null,
    }); 
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
