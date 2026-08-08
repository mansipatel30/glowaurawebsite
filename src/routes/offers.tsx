import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { coupons, discountPercent, products } from "@/data/catalog";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers & Coupons — Save on Beauty | GlowAura Beauty" },
      {
        name: "description",
        content: "Live coupon codes and the biggest discounts on skincare, makeup and haircare at GlowAura Beauty.",
      },
      { property: "og:title", content: "Offers & Coupons — GlowAura Beauty" },
      { property: "og:description", content: "Grab today's best beauty deals and coupon codes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OffersPage,
});

function OffersPage() {
  const deals = [...products].sort((a, b) => discountPercent(b) - discountPercent(a)).slice(0, 8);

  return (
    <ShopLayout crumbs={[{ label: "Offers" }]}>
      <section className="gradient-blush">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold sm:text-4xl">Offers &amp; Coupons</h1>
          <p className="mt-2 text-sm text-blush-foreground">Stack a coupon with today's biggest discounts.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coupons.map((c) => (
            <div key={c.code} className={`glow-card p-5 ${c.expired ? "opacity-50" : ""}`}>
              <p className="font-display text-2xl font-semibold">{c.code}</p>
              <p className="mt-1 text-sm text-muted-foreground">{c.label}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {c.expired ? "Expired" : `Min order ₹${c.minOrder}`}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-semibold">Biggest Discounts</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {deals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-10">
          <Button asChild size="lg">
            <Link to="/shop" search={{}}>
              Shop all products
            </Link>
          </Button>
        </div>
      </div>
    </ShopLayout>
  );
}
