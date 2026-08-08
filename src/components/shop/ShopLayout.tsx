import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";

export function ShopLayout({
  children,
  crumbs,
}: {
  children: ReactNode;
  crumbs?: { label: string; to?: string }[];
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      {crumbs?.length ? (
        <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">{c.label}</span>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
