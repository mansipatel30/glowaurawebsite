import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShopLayout } from "@/components/shop/ShopLayout";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact GlowAura Beauty — Customer Support" },
      { name: "description", content: "Reach the GlowAura Beauty support team for order, delivery or product questions." },
      { property: "og:title", content: "Contact GlowAura Beauty" },
      { property: "og:description", content: "We reply to every message within 24 hours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const i of parsed.error.issues) next[String(i.path[0])] = i.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setForm({ name: "", email: "", message: "" });
    toast.success("Thanks! Our team will reply within 24 hours.");
  };

  return (
    <ShopLayout crumbs={[{ label: "Contact" }]}>
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-semibold">Contact Us</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          support@glowaura.in · +91 98765 43210 · Mon-Sat, 10am-7pm IST
        </p>
        <form onSubmit={submit} className="glow-card mt-8 space-y-4 p-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors['name'] ? <p className="mt-1 text-xs text-destructive">{errors['name']}</p> : null}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" className="mt-1.5" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors['email'] ? <p className="mt-1 text-xs text-destructive">{errors['email']}</p> : null}
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={5} maxLength={1000} className="mt-1.5" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            {errors['message'] ? <p className="mt-1 text-xs text-destructive">{errors['message']}</p> : null}
          </div>
          <Button type="submit" size="lg">Send message</Button>
        </form>
      </div>
    </ShopLayout>
  );
}
