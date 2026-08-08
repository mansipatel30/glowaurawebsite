import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { coupons, formatINR, getProduct, FREE_SHIPPING_THRESHOLD } from "@/data/catalog";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Shopping Bag — GlowAura Beauty" },
      { name: "description", content: "Review your GlowAura Beauty bag, apply coupons and proceed to checkout." },
      { property: "og:title", content: "Your Shopping Bag — GlowAura Beauty" },
      { property: "og:description", content: "Review your items and apply a coupon before checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, setQty, removeFromCart, toggleWishlist, totals, coupon, applyCoupon, removeCoupon } = useShop();
  const [code, setCode] = useState("");
  const t = totals();

  if (cart.length === 0) {
    return (
      <ShopLayout crumbs={[{ label: "Cart" }]}>
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <p className="text-5xl">🛍️</p>
          <h1 className="mt-4 text-2xl font-semibold">Your bag is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add a few glow-getters and they'll show up right here.
          </p>
          <Button asChild className="mt-6">
            <Link to="/shop" search={{}}>
              Start shopping
            </Link>
          </Button>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout crumbs={[{ label: "Cart" }]}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">Shopping Bag ({cart.length})</h1>

        {t.subtotal < FREE_SHIPPING_THRESHOLD ? (
          <p className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm text-accent-foreground">
            Add {formatINR(FREE_SHIPPING_THRESHOLD - t.subtotal)} more to unlock free shipping ✨
          </p>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            {cart.map((line) => {
              const p = getProduct(line.slug);
              if (!p) return null;
              return (
                <article key={line.slug} className="glow-card grid grid-cols-[88px_minmax(0,1fr)] gap-4 p-4">
                  <Link to="/product/$slug" params={{ slug: p.slug }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      width={200}
                      height={200}
                      className="h-22 w-22 rounded-xl object-cover"
                    />
                  </Link>
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{p.brand}</p>
                    <Link
                      to="/product/$slug"
                      params={{ slug: p.slug }}
                      className="block truncate text-sm font-semibold hover:text-primary"
                    >
                      {p.name}
                    </Link>
                    <p className="mt-1 text-sm">
                      <span className="font-bold">{formatINR(p.price)}</span>{" "}
                      <span className="text-xs text-muted-foreground line-through">{formatINR(p.mrp)}</span>
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex items-center rounded-full border border-border">
                        <Button variant="ghost" size="icon" onClick={() => setQty(line.slug, line.qty - 1)}>
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-8 text-center text-sm">{line.qty}</span>
                        <Button variant="ghost" size="icon" onClick={() => setQty(line.slug, line.qty + 1)}>
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          toggleWishlist(line.slug);
                          removeFromCart(line.slug);
                          toast.success("Moved to wishlist ❤️");
                        }}
                      >
                        <Heart className="h-4 w-4" /> Wishlist
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          removeFromCart(line.slug);
                          toast.success("Removed from bag");
                        }}
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="space-y-4">
            <div className="glow-card p-5">
              <h2 className="text-sm font-bold uppercase tracking-widest">Apply Coupon</h2>
              {coupon ? (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-accent px-3 py-2 text-sm">
                  <span className="font-semibold text-accent-foreground">{coupon.code} applied</span>
                  <Button variant="ghost" size="sm" onClick={removeCoupon}>
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <Input
                    value={code}
                    maxLength={20}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    aria-label="Coupon code"
                  />
                  <Button
                    onClick={() => {
                      const res = applyCoupon(code);
                      if (res.ok) {
                        toast.success(res.message);
                        setCode("");
                      } else toast.error(res.message);
                    }}
                  >
                    Apply
                  </Button>
                </div>
              )}
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                {coupons
                  .filter((c) => !c.expired)
                  .map((c) => (
                    <li key={c.code}>
                      <button
                        type="button"
                        className="font-semibold text-primary"
                        onClick={() => setCode(c.code)}
                      >
                        {c.code}
                      </button>{" "}
                      — {c.label}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="glow-card p-5">
              <h2 className="text-sm font-bold uppercase tracking-widest">Price Details</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={formatINR(t.subtotal)} />
                <Row label="Product discount" value={`-${formatINR(t.discount)}`} accent />
                {t.couponDiscount > 0 ? (
                  <Row label="Coupon discount" value={`-${formatINR(t.couponDiscount)}`} accent />
                ) : null}
                <Row label="Delivery" value={t.delivery === 0 ? "FREE" : formatINR(t.delivery)} />
                <Row label="Tax" value="₹0" />
                <div className="border-t border-border pt-3">
                  <Row label="Total" value={formatINR(t.total)} bold />
                </div>
              </dl>
              <Button asChild className="mt-5 w-full" size="lg">
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </ShopLayout>
  );
}

function Row({ label, value, accent, bold }: { label: string; value: string; accent?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={bold ? "font-semibold" : "text-muted-foreground"}>{label}</dt>
      <dd className={`${bold ? "text-base font-bold" : ""} ${accent ? "text-success" : ""}`}>{value}</dd>
    </div>
  );
}
