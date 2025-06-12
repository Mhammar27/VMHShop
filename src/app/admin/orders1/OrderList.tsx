"use client";
import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import Image from "next/image";

// Color mapping for Tailwind
const colorMap = {
  pending: "yellow",
  paid: "green",
  completed: "green",
  cancelled: "red",
  default: "gray",
} as const;

const bgClassMap = {
  yellow: "bg-yellow-100 text-yellow-800",
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
  gray: "bg-gray-100 text-gray-800",
} as const;

function StatusBadge({ status }: { status?: string }) {
  const color =
    (colorMap[status as keyof typeof colorMap] as keyof typeof bgClassMap) ||
    colorMap.default;
  const bgClass = bgClassMap[color];

  return (
    <span className={`inline-block px-2 py-1 text-xs rounded font-semibold ${bgClass}`}>
      {status || "Unknown"}
    </span>
  );
}

function formatAmount(amount: any) {
  if (typeof amount === "string" || typeof amount === "number") {
    return (
      "£" +
      Number(amount).toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }
  return "";
}

function formatDate(date: any) {
  if (!date) return "";
  return new Date(date).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderList({ orders }: { orders: any[] }) {
  const [openIndexes, setOpenIndexes] = useState<{ [key: number]: boolean }>({ 0: true });

  const handleToggle = (idx: number) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="space-y-6">
      {orders.map((order: any, idx: number) => {
        const open = openIndexes[idx] || false;
        const {
          customer = {},
          amount,
          status,
          createdAt,
          description,
          cartItems = [],
        } = order;

        return (
          <div
            key={order._id}
            className="bg-white rounded shadow-md border border-gray-200 overflow-hidden"
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition"
              onClick={() => handleToggle(idx)}
            >
              <div className="flex items-center gap-3">
                {open ? (
                  <FaChevronDown className="text-gray-400" />
                ) : (
                  <FaChevronRight className="text-gray-400" />
                )}
                <span className="font-bold text-lg">
                  {customer?.firstName ?? ""} {customer?.lastName ?? ""}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  ({customer?.email ?? "No email"})
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-gray-500 text-xs">Order date:</span>{" "}
                  <span className="font-mono text-sm">{formatDate(createdAt)}</span>
                </div>
                <StatusBadge status={status} />
                <span className="font-semibold text-green-700 text-lg">
                  {formatAmount(amount)}
                </span>
              </div>
            </div>
            {open && (
              <div className="border-t px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Left: Customer/Shipping */}
                <div>
                  <div className="font-semibold mb-2">Customer Info</div>
                  <div className="text-gray-900">
                    <div>
                      {customer?.firstName} {customer?.lastName}
                    </div>
                    <div>{customer?.email}</div>
                    <div>{customer?.phone}</div>
                  </div>
                  <div className="font-semibold mt-4 mb-1">Address</div>
                  <div className="text-gray-700">
                    {customer?.address} <br />
                    {customer?.city}, {customer?.zip} <br />
                    {customer?.country ?? "United Kingdom"}
                  </div>
                </div>
                {/* Middle: Order Info */}
                <div>
                  <div className="font-semibold mb-2">Order Info</div>
                  <div className="text-gray-700">
                    <div>
                      <span className="text-gray-500">Order ID:</span>{" "}
                      <span className="font-mono">{order._id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>{" "}
                      <StatusBadge status={status} />
                    </div>
                    <div>
                      <span className="text-gray-500">Amount:</span> {formatAmount(amount)}
                    </div>
                    <div>
                      <span className="text-gray-500">Placed at:</span> {formatDate(createdAt)}
                    </div>
                    {description && (
                      <div className="mt-2 text-xs text-gray-500">{description}</div>
                    )}
                  </div>
                </div>
                {/* Right: Cart Items */}
                <div>
                  <div className="font-semibold mb-2">Cart Items</div>
                  {cartItems.length === 0 ? (
                    <div className="text-gray-400">No items</div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {cartItems.map((item: any, i: number) => (
                        <li key={i} className="py-2 flex items-center gap-3">
                          {item.image && (
                            <Image
                              src={item.image.replace(
                                /^wix:image:\/\/v1\//,
                                "/api/proxy-image/"
                              )}
                              alt={
                                (item.productName?.original ?? "Product").replace(
                                  /'/g,
                                  "&#39;"
                                )
                              }
                              width={40}
                              height={40}
                              className="w-10 h-10 object-cover rounded"
                              onError={(e: any) => {
                                e.target.style.display = "none";
                              }}
                              unoptimized
                            />
                          )}
                          <div>
                            <div className="font-medium">
                              {item.productName?.original ?? "Product"}
                            </div>
                            <div className="text-xs text-gray-500">
                              Qty: <span className="font-semibold">{item.quantity}</span>{" "}
                              {item.price?.formattedAmount && (
                                <>| {item.price.formattedAmount} each</>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}