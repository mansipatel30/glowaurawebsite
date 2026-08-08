import { createFileRoute } from "@tanstack/react-router";
import { ShopLayout } from "@/components/shop/ShopLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About GlowAura Beauty — Clean, Honest Beauty from India" },
      { name: "description", content: "GlowAura Beauty curates cruelty-free, dermatologically tested beauty essentials made for Indian skin and hair." },
      { property: "og:title", content: "About GlowAura Beauty" },
      { property: "og:description", content: "Our story, values and promise to every customer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ShopLayout crumbs={[{ label: "About Us" }]}>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-semibold">About GlowAura Beauty</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            GlowAura Beauty began with a simple idea: beauty products should be honest, affordable and made for
            real Indian routines — humid summers, hard water, long commutes and busy mornings.
          </p>
          <p>
            Every product on our shelf is cruelty-free, dermatologically tested and free from parabens and mineral
            oil. We work with formulators across India to keep quality high and prices fair.
          </p>
          <p>
            Today we ship to over 19,000 PIN codes with free delivery above ₹999 and 7-day easy returns, because
            trying something new should never feel risky.
          </p>
        </div>
      </div>
    </ShopLayout>
  ),
});
