import type { ReactNode } from "react";
import { Header } from "./Header";
import { HeaderLuxury } from "./HeaderLuxury";
import { HeaderAgency } from "./HeaderAgency";
import { HeaderModern } from "./HeaderModern";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { useHeaderVariant } from "@/hooks/use-header-variant";

export function SiteLayout({ children }: { children: ReactNode }) {
  const variant = useHeaderVariant();
  const HeaderComp =
    variant === "luxury" ? HeaderLuxury :
    variant === "agency" ? HeaderAgency :
    variant === "modern" ? HeaderModern :
    Header;
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderComp />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
