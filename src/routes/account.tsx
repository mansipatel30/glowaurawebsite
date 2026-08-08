import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { formatINR } from "@/data/catalog";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/account")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My Account & Orders — GlowAura Beauty" },
      { name: "description", content: "Track your GlowAura Beauty orders and revisit your saved favourites." },
      { property: "og:title", content: "My Account — GlowAura Beauty" },
      { property: "og:description", content: "Your GlowAura order history in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { orders } = useShop();

  return (
    <ShopLayout crumbs={[{ label: "My Account" }]}>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-semibold">My Orders</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Orders placed on this device. Sign-in accounts arrive with the next update.
        </p>

        {orders.length === 0 ? (
          <div className="glow-card mt-8 p-12 text-center">
            <p className="text-4xl">📦</p>
            <p className="mt-3 text-sm text-muted-foreground">No orders yet.</p>
            <Button asChild className="mt-5">
              <Link to="/shop" search={{}}>Start shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((o) => (
              <article key={o.id} className="glow-card grid gap-2 p-5 sm:flex sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{o.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(o.placedAt).toLocaleDateString("en-IN")} · {o.lines.length} item(s) · {o.status}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">{formatINR(o.totals.total)}</span>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/order/$id" params={{ id: o.id }}>View</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </ShopLayout>
  );
}
