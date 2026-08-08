import { createFileRoute, notFound } from "@tanstack/react-router";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { categories, products, type CategorySlug } from "@/data/catalog";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = categories.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Category not found — GlowAura Beauty" }, { name: "robots", content: "noindex" }] };
    const { category } = loaderData;
    const title = `${category.name} — Shop ${category.name} Online | GlowAura Beauty`;
    const description = `${category.blurb}. Shop ${category.name.toLowerCase()} at GlowAura Beauty with free shipping above ₹999.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <ShopLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Category not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The category you're looking for doesn't exist.</p>
      </div>
    </ShopLayout>
  ),
  errorComponent: () => (
    <ShopLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
      </div>
    </ShopLayout>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const list = products.filter((p) => p.category === (category.slug as CategorySlug));

  return (
    <ShopLayout crumbs={[{ label: category.name }]}>
      <section className="gradient-blush">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold sm:text-4xl">
            {category.emoji} {category.name}
          </h1>
          <p className="mt-2 text-sm text-blush-foreground">{category.blurb}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">{list.length} products found</p>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </ShopLayout>
  );
}
