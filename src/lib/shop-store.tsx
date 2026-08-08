import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  COD_FEE,
  DELIVERY_FEE,
  FREE_SHIPPING_THRESHOLD,
  coupons,
  getProduct,
  type Coupon,
} from "@/data/catalog";

export interface CartLine {
  slug: string;
  qty: number;
}

export interface OrderAddress {
  fullName: string;
  mobile: string;
  email: string;
  house: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  placedAt: string;
  lines: CartLine[];
  address: OrderAddress;
  delivery: "standard" | "express";
  paymentMethod: "online" | "cod";
  paymentStatus: "Paid" | "Pending";
  status: "Order Placed" | "Packed" | "Shipped" | "Out for Delivery" | "Delivered";
  totals: Totals;
  couponCode: string | null;
  eta: string;
}

export interface Totals {
  subtotal: number;
  mrpTotal: number;
  discount: number;
  couponDiscount: number;
  delivery: number;
  codFee: number;
  tax: number;
  total: number;
}

interface ShopState {
  cart: CartLine[];
  wishlist: string[];
  orders: Order[];
  coupon: Coupon | null;
  recentSearches: string[];
  addToCart: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  addRecentSearch: (q: string) => void;
  placeOrder: (input: Omit<Order, "id" | "placedAt" | "lines" | "totals" | "couponCode" | "eta" | "status">) => Order;
  cartCount: number;
  totals: (opts?: { delivery?: "standard" | "express"; cod?: boolean }) => Totals;
}

const ShopContext = createContext<ShopState | null>(null);

const KEY = "glowaura-shop-v1";

interface Persisted {
  cart: CartLine[];
  wishlist: string[];
  orders: Order[];
  couponCode: string | null;
  recentSearches: string[];
}

const empty: Persisted = { cart: [], wishlist: [], orders: [], couponCode: null, recentSearches: [] };

function read(): Persisted {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...empty, ...(JSON.parse(raw) as Persisted) } : empty;
  } catch {
    return empty;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(read());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const value = useMemo<ShopState>(() => {
    const coupon = coupons.find((c) => c.code === state.couponCode) ?? null;

    const lineTotals = () => {
      let subtotal = 0;
      let mrpTotal = 0;
      for (const line of state.cart) {
        const product = getProduct(line.slug);
        if (!product) continue;
        subtotal += product.price * line.qty;
        mrpTotal += product.mrp * line.qty;
      }
      return { subtotal, mrpTotal };
    };

    const totals: ShopState["totals"] = (opts) => {
      const { subtotal, mrpTotal } = lineTotals();
      let couponDiscount = 0;
      if (coupon && !coupon.expired && subtotal >= coupon.minOrder) {
        couponDiscount =
          coupon.type === "flat"
            ? coupon.value
            : Math.min(Math.round((subtotal * coupon.value) / 100), coupon.maxDiscount ?? Infinity);
      }
      const payable = Math.max(subtotal - couponDiscount, 0);
      const express = opts?.delivery === "express";
      const delivery =
        subtotal === 0 ? 0 : express ? DELIVERY_FEE + 60 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_FEE;
      const codFee = opts?.cod ? COD_FEE : 0;
      return {
        subtotal,
        mrpTotal,
        discount: mrpTotal - subtotal,
        couponDiscount,
        delivery,
        codFee,
        tax: 0,
        total: payable + delivery + codFee,
      };
    };

    return {
      cart: state.cart,
      wishlist: state.wishlist,
      orders: state.orders,
      coupon,
      recentSearches: state.recentSearches,
      cartCount: state.cart.reduce((n, l) => n + l.qty, 0),
      totals,
      addToCart: (slug, qty = 1) =>
        setState((s) => {
          const existing = s.cart.find((l) => l.slug === slug);
          return {
            ...s,
            cart: existing
              ? s.cart.map((l) => (l.slug === slug ? { ...l, qty: Math.min(l.qty + qty, 10) } : l))
              : [...s.cart, { slug, qty }],
          };
        }),
      setQty: (slug, qty) =>
        setState((s) => ({
          ...s,
          cart:
            qty <= 0
              ? s.cart.filter((l) => l.slug !== slug)
              : s.cart.map((l) => (l.slug === slug ? { ...l, qty: Math.min(qty, 10) } : l)),
        })),
      removeFromCart: (slug) => setState((s) => ({ ...s, cart: s.cart.filter((l) => l.slug !== slug) })),
      clearCart: () => setState((s) => ({ ...s, cart: [], couponCode: null })),
      toggleWishlist: (slug) =>
        setState((s) => ({
          ...s,
          wishlist: s.wishlist.includes(slug) ? s.wishlist.filter((w) => w !== slug) : [...s.wishlist, slug],
        })),
      isWishlisted: (slug) => state.wishlist.includes(slug),
      addRecentSearch: (q) =>
        setState((s) => ({
          ...s,
          recentSearches: [q, ...s.recentSearches.filter((r) => r !== q)].slice(0, 6),
        })),
      applyCoupon: (code) => {
        const normalized = code.trim().toUpperCase();
        const found = coupons.find((c) => c.code === normalized);
        if (!found) return { ok: false, message: "Invalid coupon code. Please check and try again." };
        if (found.expired) return { ok: false, message: `${found.code} has expired.` };
        const { subtotal } = lineTotals();
        if (subtotal < found.minOrder)
          return { ok: false, message: `${found.code} needs a minimum order of ₹${found.minOrder}.` };
        setState((s) => ({ ...s, couponCode: found.code }));
        return { ok: true, message: `Coupon ${found.code} applied successfully 🎉` };
      },
      removeCoupon: () => setState((s) => ({ ...s, couponCode: null })),
      placeOrder: (input) => {
        const t = totals({ delivery: input.delivery, cod: input.paymentMethod === "cod" });
        const seq = String(state.orders.length + 1).padStart(3, "0");
        const stamp = new Date();
        const eta = new Date(stamp.getTime() + (input.delivery === "express" ? 2 : 5) * 86400000);
        const order: Order = {
          ...input,
          id: `GA${stamp.getFullYear()}${String(stamp.getMonth() + 1).padStart(2, "0")}${String(
            stamp.getDate(),
          ).padStart(2, "0")}${seq}`,
          placedAt: stamp.toISOString(),
          lines: state.cart,
          totals: t,
          couponCode: coupon?.code ?? null,
          status: "Order Placed",
          eta: eta.toISOString(),
        };
        setState((s) => ({ ...s, orders: [order, ...s.orders], cart: [], couponCode: null }));
        return order;
      },
    };
  }, [state]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}
