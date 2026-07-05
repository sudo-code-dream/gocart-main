import { getPayMongoHeaders } from "@/lib/paymongo";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId, has } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { addressId, items, couponCode, paymentMethod } =
      await request.json();

    if (
      !addressId ||
      !paymentMethod ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing order detail" },
        { status: 400 },
      );
    }

    let coupon = null;

    if (couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: {
          code: couponCode,
        },
      });

      if (!coupon) {
        return NextResponse.json(
          { error: "Coupon code not found" },
          { status: 404 },
        );
      }
    }

    if (couponCode && coupon.forNewUser) {
      const userorders = await prisma.order.findMany({
        where: { userId },
      });
      if (userorders.length > 0) {
        return NextResponse.json(
          { error: "Coupon valid for new users only" },
          { status: 400 },
        );
      }
    }

    const isPlusMemeber = has({ plan: "plus" });

    if (couponCode && coupon.forMember) {
      if (!isPlusMemeber) {
        return NextResponse.json(
          { error: "Coupon valid for plus members only" },
          { status: 400 },
        );
      }
    }

    const ordersByStore = new Map();

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });
      const storeId = product.storeId;
      if (!ordersByStore.has(storeId)) {
        ordersByStore.set(storeId, []);
      }
      ordersByStore.get(storeId).push({ ...item, price: product.price });
    }

    let orderIds = [];
    let fullAmount = 0;

    let isShippingFeeAdded = false;

    for (const [storeId, sellerItems] of ordersByStore.entries()) {
      let total = sellerItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      if (couponCode) {
        total -= (total * coupon.discount) / 100;
      }
      if (!isPlusMemeber && !isShippingFeeAdded) {
        total += 5;
        isShippingFeeAdded = true;
      }
      fullAmount += parseFloat(total.toFixed(2));

      const order = await prisma.order.create({
        data: {
          userId,
          storeId,
          addressId,
          total: parseFloat(total.toFixed(2)),
          paymentMethod,
          isCouponUsed: coupon ? true : false,
          coupon: coupon ? coupon : {},
          orderItems: {
            create: sellerItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });
      orderIds.push(order.id);
    }

    if (paymentMethod === "QRPH") {
      const paymentIntentResponse = await fetch(
        "https://api.paymongo.com/v1/payment_intents",
        {
          method: "POST",
          headers: getPayMongoHeaders(),
          body: JSON.stringify({
            data: {
              attributes: {
                amount: Math.round(fullAmount * 100),
                currency: "PHP",
                payment_method_allowed: ["qrph"],
                description: `Order ${orderIds.join(",")}`,
              },
            },
          }),
        },
      );

      const paymentIntent = await paymentIntentResponse.json();

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

      const paymentMethodData = await paymentMethodResponse.json();

      const attachResponse = await fetch(
        `https://api.paymongo.com/v1/payment_intents/${paymentIntent.data.id}/attach`,
        {
          method: "POST",
          headers: getPayMongoHeaders(),
          body: JSON.stringify({
            data: {
              attributes: {
                payment_method: paymentMethodData.data.id,
                client_key: paymentIntent.data.attributes.client_key,
              },
            },
          }),
        },
      );

      const attachedPayment = await attachResponse.json();

      await prisma.order.updateMany({
        where: {
          id: {
            in: orderIds,
          },
        },
        data: {
          paymongoReference: paymentIntent.data.id,
        },
      });

      return NextResponse.json({
        paymentType: "QRPH",
        orderIds,
        qrImage: attachedPayment.data.attributes.next_action.code.image_url,
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { cart: {} },
    });

    return NextResponse.json({
      message: "Order Placed Successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 },
    );
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const orders = await prisma.order.findMany({
      where: {
        userId,
        OR: [
          { paymentMethod: PaymentMethod.COD },
          {
            AND: [{ paymentMethod: PaymentMethod.STRIPE }, { isPaid: true }],
          },
          {
            AND: [{ paymentMethod: PaymentMethod.QRPH }, { isPaid: true }],
          },
        ],
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        address: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
