import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/catalog";

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl font-semibold">GlowAura Beauty</h2>
          <p className="mt-1 text-sm italic text-muted-foreground">Your Beauty. Your Glow.</p>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Carefully selected skincare, makeup, haircare and self-care essentials — delivered across India.
          </p>
          <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
            <li>✓ Authentic products</li>
            <li>✓ Secure payments</li>
            <li>✓ Easy returns</li>
          </ul>
          <div className="mt-5 flex gap-3">
            <a href="https://instagram.com" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="text-muted-foreground hover:text-primary">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://youtube.com" aria-label="YouTube" className="text-muted-foreground hover:text-primary">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest">Shop</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to="/category/$slug" params={{ slug: c.slug }} className="hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest">Customer Care</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-primary">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/policies/$slug" params={{ slug: "shipping" }} className="hover:text-primary">
                Shipping
              </Link>
            </li>
            <li>
              <Link to="/policies/$slug" params={{ slug: "returns" }} className="hover:text-primary">
                Returns &amp; Refunds
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-primary">
                Track Order
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest">Company</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/policies/$slug" params={{ slug: "privacy" }} className="hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/policies/$slug" params={{ slug: "terms" }} className="hover:text-primary">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link to="/vanguard" className="hover:text-primary">
                Vanguard (demo)
              </Link>
            </li>
          </ul>

          <h3 className="mt-8 text-xs font-bold uppercase tracking-widest">Newsletter</h3>
          <p className="mt-2 text-sm text-muted-foreground">Subscribe for beauty tips and exclusive offers.</p>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                toast.error("Please enter a valid email address");
                return;
              }
              setEmail("");
              toast.success("Subscribed! Watch your inbox 💌");
            }}
          >
            <Input
              type="email"
              value={email}
              maxLength={255}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GlowAura Beauty. All rights reserved. Prices inclusive of all taxes.
      </div>
    </footer>
  );
}
