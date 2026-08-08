import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/shop/Stars";
import { discountPercent, formatINR, type Product } from "@/data/catalog";
import { useShop } from "@/lib/shop-store";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const navigate = useNavigate();
  const wished = isWishlisted(product.slug);
  const inStock = product.stock > 0;

  return (
    <article className="glow-card group flex flex-col overflow-hidden">
      <div className="relative">
        <Link to="/product/$slug" params={{ slug: product.slug }} className="block overflow-hidden">
          <img
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            loading="lazy"
            width={800}
            height={800}
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          <Badge className="bg-primary text-primary-foreground">{discountPercent(product)}% OFF</Badge>
          {product.bestSeller ? <Badge variant="secondary">Bestseller</Badge> : null}
          {product.newArrival ? <Badge variant="secondary">New</Badge> : null}
        </div>
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => {
            toggleWishlist(product.slug);
            toast.success(wished ? "Removed from wishlist" : "Added to wishlist ❤️");
          }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 backdrop-blur transition-colors hover:bg-card"
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{product.brand}</p>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="line-clamp-2 text-sm font-semibold leading-snug transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="line-clamp-2 text-xs text-muted-foreground">{product.short}</p>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Stars rating={product.rating} />
          <span>
            {product.rating} | {product.reviews} reviews
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-base font-bold">{formatINR(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{formatINR(product.mrp)}</span>
          <span className="text-xs font-semibold text-primary">{discountPercent(product)}% OFF</span>
        </div>

        <p className={`text-xs font-medium ${inStock ? "text-success" : "text-destructive"}`}>
          {inStock ? (product.stock < 10 ? `Only ${product.stock} left` : "✓ In Stock") : "Out of Stock"}
        </p>

        <div className="mt-auto flex gap-2 pt-2">
          <Button
            className="flex-1"
            size="sm"
            disabled={!inStock}
            onClick={() => {
              addToCart(product.slug);
              toast.success("Product added to cart ✓");
            }}
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!inStock}
            onClick={() => {
              addToCart(product.slug);
              navigate({ to: "/cart" });
            }}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </article>
  );
}
