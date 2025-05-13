// src/app/admin/orders/page.tsx
import clientPromise from "@/lib/mongodb";
import dynamic from "next/dynamic";

const OrderList = dynamic(() => import("./OrderList"), { ssr: false });

export default async function AdminOrdersPage() {
  const client = await clientPromise;
  const db = client.db("VMHShop");
  const orders = await db
    .collection("orders")
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-10">
      <h1 className="text-3xl mb-8 font-bold text-gray-900">Order History</h1>
      <OrderList orders={orders} />
    </div>
  );
}