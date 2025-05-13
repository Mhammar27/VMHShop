import { NextRequest, NextResponse } from "next/server";
import createMollieClient from '@mollie/api-client';
import clientPromise from "@/lib/mongodb";

const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, description, redirectUrl, customer, cartItems } = body;

    // Save order to MongoDB first
    const client = await clientPromise;
    const db = client.db("VMHShop");
    const orders = db.collection("orders");

    // Insert order and get insertedId
    const order = {
      customer,
      cartItems,
      amount,
      description,
      status: 'pending',
      createdAt: new Date(),
    };
    const result = await orders.insertOne(order);
    const orderId = result.insertedId.toString();

    // Create Mollie payment with webhookUrl
    const payment = await mollie.payments.create({
      amount: {
        currency: "GBP",
        value: Number(amount).toFixed(2),
      },
      description: description || "Order at MyShop",
      redirectUrl: redirectUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      metadata: {
        orderId,
        email: customer.email,
      },
      locale: "en_GB" as any, // <-- Fix: cast to any to bypass the type error
      webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mollie-webhook`, // <-- THIS IS THE IMPORTANT LINE!
    });

    return NextResponse.json({
      paymentUrl: payment.getCheckoutUrl(),
      orderId,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Checkout failed", details: error?.message },
      { status: 500 }
    );
  }
}