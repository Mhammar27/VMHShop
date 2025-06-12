'use client';

import React, { useEffect } from "react";
import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient"; // adjust path if needed

export default function SuccessPage() {
  const wixClient = useWixClient();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (wixClient) {
      clearCart(wixClient);
    }
  }, [clearCart, wixClient]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-4">
      <div className="bg-white rounded shadow p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">🎉 Thank You for Your Order!</h1>
        <p className="mb-2 text-lg">
          Your payment was received. We will process your order soon!
        </p>
        <a
          href="/"
          className="inline-block mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-900 transition"
        >
          Back to Shop
        </a>
      </div>
    </div>
  );
}