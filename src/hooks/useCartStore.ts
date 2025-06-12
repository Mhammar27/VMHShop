import { create } from "zustand";
import { currentCart } from "@wix/ecom";
import { WixClient } from "@/context/wixContext";

type CartState = {
  cart: currentCart.Cart | null;
  isLoading: boolean;
  counter: number;
  getCart: (wixClient: WixClient) => void;
  addItem: (
    wixClient: WixClient,
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  removeItem: (wixClient: WixClient, itemId: string) => void;
  clearCart: (wixClient: WixClient) => void; // <-- ADD THIS TYPE
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: true,
  counter: 0,
  getCart: async (wixClient) => {
    try {
      const cart = await wixClient.currentCart.getCurrentCart();
      set({
        cart: cart || null,
        isLoading: false,
        counter: cart?.lineItems?.length || 0,
      });
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      set((prev) => ({ ...prev, isLoading: false }));
    }
  },
  addItem: async (wixClient, productId, variantId, quantity) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const response = await wixClient.currentCart.addToCurrentCart({
        lineItems: [
          {
            catalogReference: {
              appId: process.env.NEXT_PUBLIC_WIX_APP_ID!,
              catalogItemId: productId,
              ...(variantId && { options: { variantId } }),
            },
            quantity: quantity,
          },
        ],
      });

      set({
        cart: response.cart,
        counter: response.cart?.lineItems?.length || 0,
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to add item:", err);
      set((state) => ({ ...state, isLoading: false }));
    }
  },
  removeItem: async (wixClient, itemId) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const response =
        await wixClient.currentCart.removeLineItemsFromCurrentCart([itemId]);

      set({
        cart: response.cart,
        counter: response.cart?.lineItems?.length || 0,
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to remove item:", err);
      set((state) => ({ ...state, isLoading: false }));
    }
  },
clearCart: async (wixClient) => {
  set((state) => ({ ...state, isLoading: true }));
  try {
    // Fetch the latest cart
    const currentCart = await wixClient.currentCart.getCurrentCart();
    const lineItemIds =
      currentCart?.lineItems?.map((item: any) => item._id) || [];

    if (lineItemIds.length > 0) {
      // Remove all items at once
      const response = await wixClient.currentCart.removeLineItemsFromCurrentCart(lineItemIds);

      set({
        cart: response.cart,
        counter: response.cart?.lineItems?.length || 0,
        isLoading: false,
      });
    } else {
      // Cart already empty
      set({
        cart: currentCart,
        counter: 0,
        isLoading: false,
      });
    }
  } catch (err) {
    console.error("Failed to clear cart:", err);
    set((state) => ({ ...state, isLoading: false }));
  }
},
}));