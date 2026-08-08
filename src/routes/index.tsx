import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, Truck, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { categories, coupons, products } from "@/data/catalog";
import heroImage from "@/assets/hero-glow.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GlowAura Beauty — Skincare, Makeup & Haircare Online in India" },
      {
        name: "description",
        content:
          "Shop premium skincare, makeup, haircare, fragrance and gift sets at GlowAura Beauty. Free shipping above ₹999, easy returns and secure payments.",
      },
      { property: "og:title", content: "GlowAura Beauty — Your Beauty. Your Glow." },
      {
        property: "og:description",
        content: "Premium beauty essentials for your everyday routine. Free shipping above ₹999.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 8);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);

  return (
    <ShopLayout>
      {/* Hero */}
      <section className="gradient-blush">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-card/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> New season edit
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Discover Your Natural Glow
            </h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground">
              Premium beauty essentials for your everyday beauty routine.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/shop" search={{}}>
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/offers">Explore Offers</Link>
              </Button>
            </div>
          </div>
          <img
            src={heroImage}
            alt="Woman with glowing skin holding a GlowAura serum bottle"
            width={1600}
            height={1104}
            className="rounded-3xl object-cover shadow-xl"
          />
        </div>
      </section>

      {/* Promise strip */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 text-xs sm:px-6 lg:grid-cols-4 lg:px-8 lg:text-sm">
          {[
            { icon: ShieldCheck, label: "100% Authentic Products" },
            { icon: Truck, label: "Free Shipping Above ₹999" },
            { icon: Undo2, label: "7-Day Easy Returns" },
            { icon: Sparkles, label: "Cruelty-Free Formulas" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="h-5 w-5 shrink-0 text-primary" />
              <span className="min-w-0">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHead title="Shop by Category" sub="Everything your routine needs, curated in one place." />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="glow-card group overflow-hidden"
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                width={800}
                height={800}
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-4">
                <h3 className="text-base font-semibold">
                  {c.emoji} {c.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Shop Now <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead title="🔥 Best Sellers" sub="Loved and repurchased by thousands of customers." />
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHead title="Coupons You Can Use Today" sub="Apply at cart and save instantly." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coupons
            .filter((c) => !c.expired)
            .map((c) => (
              <div key={c.code} className="glow-card gradient-blush p-5">
                <p className="font-display text-2xl font-semibold">{c.code}</p>
                <p className="mt-1 text-sm text-blush-foreground">{c.label}</p>
              </div>
            ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <SectionHead title="✨ New Arrivals" sub="Fresh additions to the GlowAura shelf." />
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </ShopLayout>
  );
}

function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}
