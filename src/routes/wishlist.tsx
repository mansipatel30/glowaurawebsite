import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { formatINR, getProduct } from "@/data/catalog";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "My Wishlist — GlowAura Beauty" },
      { name: "description", content: "Everything you've saved for later at GlowAura Beauty." },
      { property: "og:title", content: "My Wishlist — GlowAura Beauty" },
      { property: "og:description", content: "Your saved beauty favourites in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  if (wishlist.length === 0) {
    return (
      <ShopLayout crumbs={[{ label: "Wishlist" }]}>
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <p className="text-5xl">❤️</p>
          <h1 className="mt-4 text-2xl font-semibold">Your Wishlist is waiting for you ❤️</h1>
          <p className="mt-2 text-sm text-muted-foreground">Tap the heart on any product to save it here.</p>
          <Button asChild className="mt-6">
            <Link to="/shop" search={{}}>
              Explore products
            </Link>
          </Button>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout crumbs={[{ label: "Wishlist" }]}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">My Wishlist ({wishlist.length})</h1>
        <div className="mt-8 space-y-4">
          {wishlist.map((slug) => {
            const p = getProduct(slug);
            if (!p) return null;
            return (
              <article key={slug} className="glow-card grid grid-cols-[88px_minmax(0,1fr)] gap-4 p-4">
                <Link to="/product/$slug" params={{ slug }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={200}
                    height={200}
                    className="rounded-xl object-cover"
                  />
                </Link>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{p.brand}</p>
                  <Link
                    to="/product/$slug"
                    params={{ slug }}
                    className="block truncate text-sm font-semibold hover:text-primary"
                  >
                    {p.name}
                  </Link>
                  <p className="mt-1 text-sm font-bold">{formatINR(p.price)}</p>
                  <p className={`text-xs ${p.stock > 0 ? "text-success" : "text-destructive"}`}>
                    {p.stock > 0 ? "✓ In Stock" : "Out of Stock"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      disabled={p.stock === 0}
                      onClick={() => {
                        addToCart(slug);
                        toggleWishlist(slug);
                        toast.success("Moved to cart ✓");
                      }}
                    >
                      Move to Cart
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleWishlist(slug)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </ShopLayout>
  );
}
