import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/catalog";
import { useShop } from "@/lib/shop-store";

export function Header() {
  const { cartCount, wishlist, addRecentSearch, recentSearches } = useShop();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    addRecentSearch(q);
    setOpen(false);
    setFocused(false);
    navigate({ to: "/shop", search: { q } });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="gradient-blush px-4 py-2 text-center text-[11px] font-medium tracking-wide text-blush-foreground sm:text-xs">
        ✨ Free Shipping on Orders Above ₹999 | Easy Returns | Secure Payments ✨
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            G
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-xl font-semibold leading-none sm:text-2xl">
              GlowAura Beauty
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:block">
              Your Beauty. Your Glow.
            </span>
          </span>
        </Link>

        <form onSubmit={submit} className="relative order-3 col-span-2 lg:order-none lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 150)}
            placeholder="Search for skincare, makeup, haircare…"
            className="h-11 rounded-full pl-10"
            aria-label="Search products"
          />
          {focused && recentSearches.length > 0 && !query ? (
            <div className="absolute left-0 right-0 top-12 z-50 rounded-xl border border-border bg-card p-2 shadow-lg">
              <p className="px-2 pb-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                Recent searches
              </p>
              {recentSearches.map((r) => (
                <button
                  key={r}
                  type="button"
                  className="block w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-muted"
                  onClick={() => navigate({ to: "/shop", search: { q: r } })}
                >
                  {r}
                </button>
              ))}
            </div>
          ) : null}
        </form>

        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Link to="/account" aria-label="My account">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link to="/wishlist" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 ? <Dot count={wishlist.length} /> : null}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link to="/cart" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 ? <Dot count={cartCount} /> : null}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <nav className="mx-auto hidden max-w-7xl gap-6 px-4 pb-3 text-xs font-semibold uppercase tracking-widest sm:px-6 lg:flex lg:px-8">
        <Link to="/" className="text-muted-foreground transition-colors hover:text-primary">
          Home
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/category/$slug"
            params={{ slug: c.slug }}
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            {c.name}
          </Link>
        ))}
        <Link to="/offers" className="text-primary">
          Offers
        </Link>
      </nav>

      {open ? (
        <nav className="border-t border-border bg-card px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link to="/shop" search={{}} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-muted">
              Shop All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-muted"
              >
                {c.emoji} {c.name}
              </Link>
            ))}
            <Link to="/offers" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 font-semibold text-primary">
              Offers
            </Link>
            <Link to="/account" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-muted">
              My Account
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function Dot({ count }: { count: number }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
      {count}
    </span>
  );
}
