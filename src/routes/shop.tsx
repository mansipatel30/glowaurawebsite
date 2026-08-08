import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import {
  categories,
  discountPercent,
  products,
  searchProducts,
  type CategorySlug,
} from "@/data/catalog";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop All Beauty Products — GlowAura Beauty" },
      {
        name: "description",
        content:
          "Browse the full GlowAura Beauty catalogue: skincare, makeup, haircare, fragrance, bath & body, tools and gift sets with filters and sorting.",
      },
      { property: "og:title", content: "Shop All — GlowAura Beauty" },
      { property: "og:description", content: "Filter by category, price, rating and discount." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

type SortKey = "popularity" | "price-asc" | "price-desc" | "newest" | "rating" | "discount";

const priceBuckets = [
  { id: "u300", label: "Under ₹300", test: (p: number) => p < 300 },
  { id: "300-500", label: "₹300 – ₹500", test: (p: number) => p >= 300 && p <= 500 },
  { id: "500-1000", label: "₹500 – ₹1,000", test: (p: number) => p > 500 && p <= 1000 },
  { id: "a1000", label: "Above ₹1,000", test: (p: number) => p > 1000 },
];

function ShopPage() {
  const { q, category } = Route.useSearch();
  const navigate = useNavigate();

  const [cats, setCats] = useState<CategorySlug[]>(category ? [category as CategorySlug] : []);
  const [prices, setPrices] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [minDiscount, setMinDiscount] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("popularity");
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    let list = searchProducts(q ?? "");
    if (cats.length) list = list.filter((p) => cats.includes(p.category));
    if (prices.length)
      list = list.filter((p) => prices.some((id) => priceBuckets.find((b) => b.id === id)?.test(p.price)));
    if (minRating) list = list.filter((p) => p.rating >= minRating);
    if (minDiscount) list = list.filter((p) => discountPercent(p) >= minDiscount);
    if (inStockOnly) list = list.filter((p) => p.stock > 0);

    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        sorted.sort((a, b) => discountPercent(b) - discountPercent(a));
        break;
      case "newest":
        sorted.sort((a, b) => Number(Boolean(b.newArrival)) - Number(Boolean(a.newArrival)));
        break;
      default:
        sorted.sort((a, b) => b.reviews - a.reviews);
    }
    return sorted;
  }, [q, cats, prices, minRating, minDiscount, inStockOnly, sort]);

  const toggle = <T,>(arr: T[], value: T, set: (v: T[]) => void) =>
    set(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);

  const clearAll = () => {
    setCats([]);
    setPrices([]);
    setMinRating(null);
    setMinDiscount(null);
    setInStockOnly(false);
    navigate({ to: "/shop", search: {} });
  };

  const filters = (
    <div className="space-y-6">
      <FilterBlock title="Category">
        {categories.map((c) => (
          <CheckRow
            key={c.slug}
            id={`cat-${c.slug}`}
            label={c.name}
            checked={cats.includes(c.slug)}
            onChange={() => toggle(cats, c.slug, setCats)}
          />
        ))}
      </FilterBlock>

      <FilterBlock title="Price">
        {priceBuckets.map((b) => (
          <CheckRow
            key={b.id}
            id={`price-${b.id}`}
            label={b.label}
            checked={prices.includes(b.id)}
            onChange={() => toggle(prices, b.id, setPrices)}
          />
        ))}
      </FilterBlock>

      <FilterBlock title="Rating">
        {[4, 3].map((r) => (
          <CheckRow
            key={r}
            id={`rating-${r}`}
            label={`${r}★ & above`}
            checked={minRating === r}
            onChange={() => setMinRating(minRating === r ? null : r)}
          />
        ))}
      </FilterBlock>

      <FilterBlock title="Discount">
        {[10, 20, 30, 50].map((d) => (
          <CheckRow
            key={d}
            id={`disc-${d}`}
            label={`${d}% and above`}
            checked={minDiscount === d}
            onChange={() => setMinDiscount(minDiscount === d ? null : d)}
          />
        ))}
      </FilterBlock>

      <FilterBlock title="Availability">
        <CheckRow
          id="in-stock"
          label="In Stock"
          checked={inStockOnly}
          onChange={() => setInStockOnly((v) => !v)}
        />
      </FilterBlock>

      <Button variant="outline" className="w-full" onClick={clearAll}>
        Clear all filters
      </Button>
    </div>
  );

  return (
    <ShopLayout crumbs={[{ label: q ? `Search: ${q}` : "Shop All" }]}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:flex sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold sm:text-3xl">{q ? `Results for “${q}”` : "Shop All"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{results.length} products found</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters((v) => !v)}>
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-[190px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="discount">Biggest Discount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>{filters}</aside>

          <div>
            {results.length === 0 ? (
              <div className="glow-card p-12 text-center">
                <p className="text-4xl">🔍</p>
                <h2 className="mt-3 text-lg font-semibold">No products matched</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search term or clear a few filters.
                </p>
                <Button className="mt-5" onClick={clearAll}>
                  Reset filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h2 className="text-xs font-bold uppercase tracking-widest">{title}</h2>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function CheckRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="text-sm font-normal">
        {label}
      </Label>
    </div>
  );
}

export { products };
