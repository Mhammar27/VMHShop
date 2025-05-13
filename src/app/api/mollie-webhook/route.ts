import { NextRequest } from "next/server";
import createMollieClient from "@mollie/api-client";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb"; // <-- ADD THIS LINE

const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });

export async function POST(req: NextRequest) {
  // Mollie POSTs the payment id as form data
  const form = await req.formData();
  const paymentId = form.get("id") as string;

  if (!paymentId) return new Response("No payment id", { status: 400 });

  try {
    // Fetch payment from Mollie
    const payment = await mollie.payments.get(paymentId);

    // Get your order id from Mollie metadata (type assertion fix)
    const orderId = (payment.metadata as { orderId?: string })?.orderId;
    if (!orderId) return new Response("No orderId in metadata", { status: 400 });

    // Map Mollie status to your status
    let newStatus = "pending";
    if (payment.status === "paid") newStatus = "paid";
    else if (
      payment.status === "failed" ||
      payment.status === "canceled" ||
      payment.status === "expired"
    ) newStatus = "cancelled";
    else if (payment.status === "authorized") newStatus = "authorized";

    // Update the order in MongoDB
    const client = await clientPromise;
    const db = client.db("VMHShop");
    await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) }, // <-- CONVERT orderId TO ObjectId
      {
        $set: { status: newStatus, mollieStatus: payment.status },
      }
    );

    return new Response("OK");
  } catch (err) {
    console.error("Mollie webhook error:", err);
    return new Response("Server error", { status: 500 });
  }
}