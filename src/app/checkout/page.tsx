"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";
import { useRouter } from "next/navigation";

// Helper functions
function getCartSubtotal(cart: any): number {
  if (!cart?.lineItems) return 0;
  return cart.lineItems.reduce(
    (sum: number, item: any) =>
      sum + (Number(item.price?.amount) || 0) * (Number(item.quantity) || 1),
    0
  );
}

function calculateTotals(cart: any) {
  const subtotal = getCartSubtotal(cart);
  const hasItems = cart?.lineItems?.length > 0;
  const delivery = hasItems ? 10 : 0;
  const salesTax = subtotal * 0.2;
  const total = subtotal + delivery;

  return {
    subtotal,
    delivery,
    salesTax,
    total,
    hasItems,
  };
}

export default function CheckoutPage() {
  const wixClient = useWixClient();
  const { cart, getCart, removeItem, isLoading } = useCartStore();

  // Always fetch cart on mount!
  useEffect(() => {
    getCart(wixClient);
  }, [wixClient, getCart]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { total } = calculateTotals(cart);
    const amount = total.toFixed(2);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          description: `Order for ${form.firstName} ${form.lastName}`,
          redirectUrl: `${window.location.origin}/success`,
          customer: form,
          cartItems: cart?.lineItems || [],
        }),
      });
      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setError(data.error || "Payment setup failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="flex justify-between items-start gap-8">
          {/* Left - Delivery Details */}
          <div className="flex-1 bg-white rounded shadow p-8">
            <h1 className="text-2xl font-semibold mb-8 tracking-tight">
              VHMSHOP <span className="font-normal">CHECKOUT</span>
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 font-medium">Email *</label>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full border px-3 py-2 rounded"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <h2 className="mt-6 mb-2 font-semibold">Delivery details</h2>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">First name *</label>
                  <input
                    required
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    className="w-full border px-3 py-2 rounded"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Last name *</label>
                  <input
                    required
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    className="w-full border px-3 py-2 rounded"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Phone *</label>
                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  className="w-full border px-3 py-2 rounded"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Country/Region *
                </label>
                <input
                  readOnly
                  type="text"
                  name="country"
                  className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                  value="United Kingdom"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Address *</label>
                <input
                  required
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="w-full border px-3 py-2 rounded"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">City *</label>
                  <input
                    required
                    type="text"
                    name="city"
                    placeholder="e.g. London"
                    className="w-full border px-3 py-2 rounded"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">
                    Zip / Postal code *
                  </label>
                  <input
                    required
                    type="text"
                    name="zip"
                    placeholder="Zip / Postal code"
                    className="w-full border px-3 py-2 rounded"
                    value={form.zip}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !cart?.lineItems?.length}
                className={`mt-6 w-full py-3 rounded font-semibold transition ${
                  cart?.lineItems?.length
                    ? "bg-black text-white hover:bg-gray-900"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? "Redirecting..." : "Pay Now"}
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
          </div>

          {/* Right - Order Summary with controls */}
          <div className="w-[340px] bg-white rounded shadow p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-lg">
                Order summary ({cart?.lineItems?.length || 0})
              </span>
            </div>
            {cart?.lineItems?.length === 0 && (
              <div className="text-center text-gray-500 mb-4">
                Your cart is empty
              </div>
            )}
            <div>
              {cart?.lineItems?.map((item: any) => (
                <div className="flex flex-col mb-4 gap-1" key={item._id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {item.productName?.original}
                      </div>
                      <div className="text-gray-500 text-xs">
                        €{item.price?.amount} each
                      </div>
                      <div className="text-gray-700 text-xs mt-1">
                        Quantity:{" "}
                        <span className="font-semibold">{item.quantity}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <button
                        className="text-xs text-red-500 border border-red-200 rounded px-2 py-0.5 hover:bg-red-50 transition"
                        disabled={isLoading}
                        onClick={() => removeItem(wixClient, item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-2 text-sm">
              {(() => {
                const { subtotal, delivery, salesTax, total, hasItems } =
                  calculateTotals(cart);
                return (
                  <>
                    <div className="flex justify-between">
                      <span>Subtotal with taxes</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span>{hasItems ? `€${delivery.toFixed(2)}` : "--"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sales Tax</span>
                      <span>20%</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span>€{total.toFixed(2)}</span>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="flex items-center mt-4 text-xs text-gray-500 justify-center">
              <span>🔒 Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
