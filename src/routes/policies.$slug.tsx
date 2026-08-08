import { createFileRoute, notFound } from "@tanstack/react-router";
import { ShopLayout } from "@/components/shop/ShopLayout";

const policies: Record<string, { title: string; body: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    body: [
      "We collect only the information needed to process and deliver your order: name, contact details and delivery address.",
      "We never sell your data. Payment details are handled by our payment partner and are never stored on our servers.",
      "You can request deletion of your data any time by writing to support@glowaura.in.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    body: [
      "By placing an order on GlowAura Beauty you confirm that the information you provide is accurate and complete.",
      "Prices, offers and availability may change without notice. Coupons cannot be combined unless stated.",
      "All product images are indicative; packaging may vary between batches.",
    ],
  },
  shipping: {
    title: "Shipping Policy",
    body: [
      "Orders are dispatched within 24 hours of confirmation on working days.",
      "Standard delivery takes 3-5 business days; express delivery takes 1-2 business days.",
      "Shipping is free on orders above ₹999. Below that a flat ₹40 fee applies. COD adds ₹40.",
    ],
  },
  returns: {
    title: "Returns & Refunds",
    body: [
      "Unopened products can be returned within 7 days of delivery.",
      "Refunds are processed to the original payment method within 5-7 business days of pickup.",
      "For hygiene reasons, opened skincare and makeup cannot be returned unless damaged or defective.",
    ],
  },
};

export const Route = createFileRoute("/policies/$slug")({
  loader: ({ params }) => {
    const policy = policies[params.slug];
    if (!policy) throw notFound();
    return { policy };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Policy not found — GlowAura Beauty" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.policy.title} — GlowAura Beauty`;
    const description = loaderData.policy.body[0] ?? "";
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
        <h1 className="text-2xl font-semibold">Policy not found</h1>
      </div>
    </ShopLayout>
  ),
  errorComponent: () => (
    <ShopLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">This page didn't load</h1>
      </div>
    </ShopLayout>
  ),
  component: PolicyPage,
});

function PolicyPage() {
  const { policy } = Route.useLoaderData();
  return (
    <ShopLayout crumbs={[{ label: policy.title }]}>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-semibold">{policy.title}</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
          {policy.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </ShopLayout>
  );
}
