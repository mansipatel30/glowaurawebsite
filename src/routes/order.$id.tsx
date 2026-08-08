import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { formatINR, getProduct } from "@/data/catalog";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/order/$id")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Order Confirmed — GlowAura Beauty" },
      { name: "description", content: "Your GlowAura Beauty order has been placed successfully." },
      { property: "og:title", content: "Order Confirmed — GlowAura Beauty" },
      { property: "og:description", content: "Thank you for shopping with GlowAura Beauty." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { id } = Route.useParams();
  const { orders } = useShop();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <ShopLayout crumbs={[{ label: "Order" }]}>
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="text-2xl font-semibold">Order not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">We couldn't find order {id} on this device.</p>
          <Button asChild className="mt-6">
            <Link to="/shop" search={{}}>
              Continue shopping
            </Link>
          </Button>
        </div>
      </ShopLayout>
    );
  }

  const eta = new Date(order.eta).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <ShopLayout crumbs={[{ label: `Order ${order.id}` }]}>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="glow-card gradient-blush p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
          <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">Order Confirmed 🎉</h1>
          <p className="mt-2 text-sm text-blush-foreground">
            Order ID <span className="font-semibold">{order.id}</span> · Estimated delivery {eta}
          </p>
        </div>

        <div className="glow-card mt-6 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest">Items</h2>
          <ul className="mt-4 space-y-3">
            {order.lines.map((line) => {
              const p = getProduct(line.slug);
              if (!p) return null;
              return (
                <li key={line.slug} className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={100}
                    height={100}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {line.qty}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold">{formatINR(p.price * line.qty)}</span>
                </li>
              );
            })}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Payment</dt>
              <dd>
                {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"} · {order.paymentStatus}
              </dd>
            </div>
            <div className="flex justify-between text-base font-bold">
              <dt>Total paid</dt>
              <dd>{formatINR(order.totals.total)}</dd>
            </div>
          </dl>

          <div className="mt-6 rounded-2xl bg-secondary/60 p-4 text-sm">
            <p className="font-semibold">Shipping to</p>
            <p className="mt-1 text-muted-foreground">
              {order.address.fullName}, {order.address.house}, {order.address.street}, {order.address.area},{" "}
              {order.address.city}, {order.address.state} — {order.address.pincode}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/shop" search={{}}>
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
