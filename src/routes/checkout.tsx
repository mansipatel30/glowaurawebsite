import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { formatINR, getProduct } from "@/data/catalog";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — GlowAura Beauty" },
      { name: "description", content: "Enter your delivery address and payment method to complete your GlowAura Beauty order." },
      { property: "og:title", content: "Secure Checkout — GlowAura Beauty" },
      { property: "og:description", content: "Fast, secure checkout with COD and online payment options." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().trim().email("Enter a valid email").max(120),
  house: z.string().trim().min(1, "House / flat number is required").max(80),
  street: z.string().trim().min(1, "Street is required").max(120),
  area: z.string().trim().min(1, "Area / locality is required").max(120),
  city: z.string().trim().min(1, "City is required").max(60),
  state: z.string().trim().min(1, "State is required").max(60),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
});

type AddressForm = z.infer<typeof addressSchema>;

const emptyAddress: AddressForm = {
  fullName: "",
  mobile: "",
  email: "",
  house: "",
  street: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
};

function CheckoutPage() {
  const { cart, totals, placeOrder, coupon } = useShop();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<AddressForm>(emptyAddress);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressForm, string>>>({});
  const [delivery, setDelivery] = useState<"standard" | "express">("standard");
  const [payment, setPayment] = useState<"online" | "cod">("online");
  const [placing, setPlacing] = useState(false);

  const t = totals({ delivery, cod: payment === "cod" });

  if (cart.length === 0) {
    return (
      <ShopLayout crumbs={[{ label: "Checkout" }]}>
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="text-2xl font-semibold">Nothing to check out</h1>
          <Button asChild className="mt-6">
            <Link to="/shop" search={{}}>
              Continue shopping
            </Link>
          </Button>
        </div>
      </ShopLayout>
    );
  }

  const field = (name: keyof AddressForm, label: string, placeholder: string, type = "text") => (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        value={address[name]}
        placeholder={placeholder}
        onChange={(e) => setAddress((a) => ({ ...a, [name]: e.target.value }))}
        className="mt-1.5"
        aria-invalid={Boolean(errors[name])}
      />
      {errors[name] ? <p className="mt-1 text-xs text-destructive">{errors[name]}</p> : null}
    </div>
  );

  const validateAddress = () => {
    const parsed = addressSchema.safeParse(address);
    if (!parsed.success) {
      const next: Partial<Record<keyof AddressForm, string>> = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof AddressForm] = issue.message;
      setErrors(next);
      toast.error("Please fix the highlighted fields");
      return false;
    }
    setErrors({});
    return true;
  };

  const submit = async () => {
    if (!validateAddress()) return;
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 900));
    const order = placeOrder({
      address,
      delivery,
      paymentMethod: payment,
      paymentStatus: payment === "online" ? "Paid" : "Pending",
    });
    setPlacing(false);
    toast.success("Order placed successfully 🎉");
    navigate({ to: "/order/$id", params: { id: order.id } });
  };

  return (
    <ShopLayout crumbs={[{ label: "Checkout" }]}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">Checkout</h1>

        <ol className="mt-5 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest">
          {["Address", "Delivery", "Payment"].map((label, i) => (
            <li
              key={label}
              className={`rounded-full px-3 py-1.5 ${
                step === i + 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {i + 1}. {label}
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="glow-card p-6">
            {step === 1 ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Delivery Address</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {field("fullName", "Full name", "Ananya Sharma")}
                  {field("mobile", "Mobile number", "9876543210", "tel")}
                  {field("email", "Email", "you@example.com", "email")}
                  {field("pincode", "PIN code", "400001")}
                  {field("house", "House / Flat no.", "B-402")}
                  {field("street", "Street", "Linking Road")}
                  {field("area", "Area / Locality", "Bandra West")}
                  {field("city", "City", "Mumbai")}
                  {field("state", "State", "Maharashtra")}
                </div>
                <Button
                  size="lg"
                  onClick={() => {
                    if (validateAddress()) setStep(2);
                  }}
                >
                  Continue to delivery
                </Button>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold">Delivery Options</h2>
                <RadioGroup value={delivery} onValueChange={(v) => setDelivery(v as typeof delivery)}>
                  <OptionRow
                    id="standard"
                    title="Standard Delivery — 3-5 days"
                    sub={t.subtotal >= 999 ? "Free" : "₹40"}
                  />
                  <OptionRow id="express" title="Express Delivery — 1-2 days" sub="₹100" />
                </RadioGroup>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)}>Continue to payment</Button>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold">Payment Method</h2>
                <RadioGroup value={payment} onValueChange={(v) => setPayment(v as typeof payment)}>
                  <OptionRow id="online" title="Pay Online (UPI / Card / Netbanking)" sub="Secure payment" />
                  <OptionRow id="cod" title="Cash on Delivery" sub="₹40 handling fee" />
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  This is a demo checkout — no real money is charged. Live Razorpay payments can be enabled next.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button size="lg" onClick={submit} disabled={placing}>
                    {placing ? "Placing order…" : `Place Order · ${formatINR(t.total)}`}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          <aside className="glow-card h-fit p-5">
            <h2 className="text-sm font-bold uppercase tracking-widest">Order Summary</h2>
            <ul className="mt-4 space-y-3">
              {cart.map((line) => {
                const p = getProduct(line.slug);
                if (!p) return null;
                return (
                  <li key={line.slug} className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      width={100}
                      height={100}
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">Qty {line.qty}</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold">{formatINR(p.price * line.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <SummaryRow label="Subtotal" value={formatINR(t.subtotal)} />
              {t.couponDiscount > 0 ? (
                <SummaryRow label={`Coupon (${coupon?.code})`} value={`-${formatINR(t.couponDiscount)}`} />
              ) : null}
              <SummaryRow label="Delivery" value={t.delivery === 0 ? "FREE" : formatINR(t.delivery)} />
              {t.codFee > 0 ? <SummaryRow label="COD fee" value={formatINR(t.codFee)} /> : null}
              <div className="flex items-center justify-between border-t border-border pt-3 text-base font-bold">
                <dt>Total</dt>
                <dd>{formatINR(t.total)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </ShopLayout>
  );
}

function OptionRow({ id, title, sub }: { id: string; title: string; sub: string }) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border p-4 has-[button[data-state=checked]]:border-primary"
    >
      <RadioGroupItem value={id} id={id} />
      <span className="min-w-0 flex-1 text-sm font-medium">{title}</span>
      <span className="shrink-0 text-xs text-muted-foreground">{sub}</span>
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
