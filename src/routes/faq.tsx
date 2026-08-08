import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShopLayout } from "@/components/shop/ShopLayout";

const faqs = [
  ["How long does delivery take?", "Standard delivery arrives in 3-5 business days; express delivery in 1-2 business days."],
  ["Is shipping free?", "Shipping is free on all orders above ₹999. Below that a flat ₹40 fee applies."],
  ["Can I return a product?", "Yes — unopened products can be returned within 7 days of delivery for a full refund."],
  ["Are your products cruelty-free?", "Every GlowAura product is cruelty-free and never tested on animals."],
  ["Do you offer Cash on Delivery?", "Yes, COD is available on most PIN codes with a ₹40 handling fee."],
  ["How do I apply a coupon?", "Enter the code in the coupon box on the cart page and tap Apply."],
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQs — Shipping, Returns & Payments | GlowAura Beauty" },
      { name: "description", content: "Answers to common questions about GlowAura Beauty delivery, returns, coupons and payment options." },
      { property: "og:title", content: "GlowAura Beauty FAQs" },
      { property: "og:description", content: "Shipping, returns, coupons and payment questions answered." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ShopLayout crumbs={[{ label: "FAQs" }]}>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-semibold">Frequently Asked Questions</h1>
        <Accordion type="single" collapsible className="mt-6">
          {faqs.map(([q, a]) => (
            <AccordionItem key={q} value={q as string}>
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionContent>{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ShopLayout>
  ),
});
