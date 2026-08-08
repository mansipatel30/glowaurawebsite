import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Heart, Minus, Plus, ShieldCheck, ShoppingBag, Truck, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { Stars } from "@/components/shop/Stars";
import { categoryName, discountPercent, formatINR, getProduct, products } from "@/data/catalog";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Product not found — GlowAura Beauty" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.product;
    const title = `${p.name} by ${p.brand} — ${formatINR(p.price)} | GlowAura Beauty`;
    return {
      meta: [
        { title },
        { name: "description", content: p.short },
        { property: "og:title", content: title },
        { property: "og:description", content: p.short },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            brand: { "@type": "Brand", name: p.brand },
            description: p.short,
            aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews },
            offers: {
              "@type": "Offer",
              price: p.price,
              priceCurrency: "INR",
              availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <ShopLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Button asChild className="mt-6">
          <Link to="/shop" search={{}}>
            Back to shop
          </Link>
        </Button>
      </div>
    </ShopLayout>
  ),
  errorComponent: () => (
    <ShopLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">This product didn't load</h1>
      </div>
    </ShopLayout>
  ),
  component: ProductPage,
});

const SERVICEABLE = ["1", "2", "3", "4", "5", "6", "7"];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [pin, setPin] = useState("");
  const [pinResult, setPinResult] = useState<string | null>(null);

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);
  const bought = products.filter((p) => p.slug !== product.slug && p.bestSeller).slice(0, 2);
  const wished = isWishlisted(product.slug);

  const checkPin = () => {
    if (!/^\d{6}$/.test(pin)) {
      setPinResult("Please enter a valid 6-digit PIN code.");
      return;
    }
    const ok = SERVICEABLE.includes(pin[0] ?? "");
    setPinResult(
      ok
        ? `Deliverable to ${pin} in 3-5 business days. Cash on Delivery available.`
        : `Sorry, we don't deliver to ${pin} yet.`,
    );
  };

  const ratingSplit = [
    { star: 5, pct: 62 },
    { star: 4, pct: 24 },
    { star: 3, pct: 8 },
    { star: 2, pct: 4 },
    { star: 1, pct: 2 },
  ];

  return (
    <ShopLayout crumbs={[{ label: categoryName(product.category) }, { label: product.name }]}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              <img
                src={product.image}
                alt={`${product.brand} ${product.name}`}
                width={800}
                height={800}
                className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={product.image}
                  alt={`${product.name} view ${i + 1}`}
                  loading="lazy"
                  width={200}
                  height={200}
                  className="aspect-square w-full rounded-xl border border-border object-cover"
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{product.brand}</p>
            <h1 className="mt-2 text-3xl font-semibold">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Stars rating={product.rating} />
              <span>
                {product.rating} · {product.reviews} reviews
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold">{formatINR(product.price)}</span>
              <span className="text-base text-muted-foreground line-through">{formatINR(product.mrp)}</span>
              <Badge className="bg-primary text-primary-foreground">{discountPercent(product)}% OFF</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>
            <p className={`mt-3 text-sm font-medium ${product.stock > 0 ? "text-success" : "text-destructive"}`}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} units)` : "Out of Stock"}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-full border border-border">
                <Button variant="ghost" size="icon" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <Button variant="ghost" size="icon" onClick={() => setQty((q) => Math.min(10, q + 1))}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-muted-foreground">Max 10 units per order</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                disabled={product.stock === 0}
                onClick={() => {
                  addToCart(product.slug, qty);
                  toast.success("Product added to cart ✓");
                }}
              >
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </Button>
              <Button
                size="lg"
                variant="secondary"
                disabled={product.stock === 0}
                onClick={() => {
                  addToCart(product.slug, qty);
                  navigate({ to: "/checkout" });
                }}
              >
                Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  toggleWishlist(product.slug);
                  toast.success(wished ? "Removed from wishlist" : "Added to wishlist ❤️");
                }}
              >
                <Heart className={`h-4 w-4 ${wished ? "fill-primary text-primary" : ""}`} /> Wishlist
              </Button>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-4">
              <p className="text-sm font-semibold">Check delivery</p>
              <div className="mt-2 flex gap-2">
                <Input
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit PIN code"
                  inputMode="numeric"
                  aria-label="PIN code"
                />
                <Button variant="outline" onClick={checkPin}>
                  Check
                </Button>
              </div>
              {pinResult ? <p className="mt-2 text-xs text-muted-foreground">{pinResult}</p> : null}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Truck className="h-4 w-4 text-primary" /> Fast delivery
              </span>
              <span className="flex items-center gap-1">
                <Undo2 className="h-4 w-4 text-primary" /> 7-day returns
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-primary" /> 100% authentic
              </span>
            </div>

            <Accordion type="single" collapsible defaultValue="desc" className="mt-8">
              <AccordionItem value="desc">
                <AccordionTrigger>Product Description</AccordionTrigger>
                <AccordionContent>{product.description}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="benefits">
                <AccordionTrigger>Key Benefits</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {product.benefits.map((b) => (
                      <li key={b} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ingredients">
                <AccordionTrigger>Ingredients</AccordionTrigger>
                <AccordionContent>{product.ingredients}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="how">
                <AccordionTrigger>How to Use</AccordionTrigger>
                <AccordionContent>{product.howToUse}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="suitable">
                <AccordionTrigger>Suitable For</AccordionTrigger>
                <AccordionContent>{product.suitableFor}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="info">
                <AccordionTrigger>Product Information</AccordionTrigger>
                <AccordionContent>
                  SKU: {product.id} · Brand: {product.brand} · Category: {categoryName(product.category)} · Country
                  of origin: India · Marketed by GlowAura Beauty Pvt. Ltd., Mumbai.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping &amp; Returns</AccordionTrigger>
                <AccordionContent>
                  Dispatched within 24 hours. Free shipping on orders above ₹999, otherwise ₹40. Returns accepted
                  within 7 days of delivery for unopened products.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold">Customer Reviews</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="glow-card p-6 text-center">
              <p className="text-5xl font-bold">{product.rating}</p>
              <Stars rating={product.rating} className="mt-2 justify-center" />
              <p className="mt-1 text-xs text-muted-foreground">{product.reviews} verified reviews</p>
              <div className="mt-5 space-y-2">
                {ratingSplit.map((r) => (
                  <div key={r.star} className="flex items-center gap-2 text-xs">
                    <span className="w-6 shrink-0">{r.star}★</span>
                    <Progress value={r.pct} className="h-2" />
                    <span className="w-8 shrink-0 text-right text-muted-foreground">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                { name: "Ananya S.", title: "Genuinely worth the price", text: "Three weeks in and my skin looks so much brighter. Absorbs fast and layers well under makeup." },
                { name: "Ritika M.", title: "Great for Indian summers", text: "Lightweight and non-sticky even in Chennai humidity. Repurchasing for sure." },
                { name: "Pooja K.", title: "Good, packaging could improve", text: "The formula is lovely but the pump was a little stiff at first. Still recommending it." },
              ].map((r) => (
                <article key={r.name} className="glow-card p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Stars rating={5} />
                    <span className="text-sm font-semibold">{r.title}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      Verified Purchase
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                  <p className="mt-2 text-xs text-muted-foreground">— {r.name}</p>
                </article>
              ))}
              <p className="rounded-2xl border border-dashed border-border p-4 text-xs text-muted-foreground">
                Only customers who purchased this product can write a review. Sign in to your account after
                delivery to rate it.
              </p>
            </div>
          </div>
        </section>

        {/* Frequently bought together */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold">Frequently Bought Together</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {bought.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold">You May Also Like</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </ShopLayout>
  );
}
