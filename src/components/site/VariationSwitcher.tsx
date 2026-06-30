import { Link, useRouterState } from "@tanstack/react-router";
import { Layout, Sparkles } from "lucide-react";
import {
  type HeaderVariant,
  setHeaderVariant,
  useHeaderVariant,
} from "@/hooks/use-header-variant";

const VARIATIONS = [
  { to: "/", label: "Classic" },
  { to: "/home/luxury", label: "Luxury Gold" },
  { to: "/home/agency", label: "Agency" },
  { to: "/home/modern", label: "Modern" },
] as const;

const HEADERS: { id: HeaderVariant; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "luxury", label: "Luxury" },
  { id: "agency", label: "Agency" },
  { id: "modern", label: "Modern" },
];

export function VariationSwitcher() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const headerVariant = useHeaderVariant();
  return (
    <div className="fixed bottom-24 right-6 z-40 hidden md:flex flex-col items-end gap-2">
      <div className="flex items-center gap-1 rounded-full border border-border bg-background/95 backdrop-blur shadow-elegant px-2 py-1.5">
        <Sparkles className="h-3.5 w-3.5 text-gold ml-1.5 mr-0.5" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mr-1">Home</span>
        {VARIATIONS.map((v) => {
          const active = pathname === v.to;
          return (
            <Link
              key={v.to}
              to={v.to}
              className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-primary"
              }`}
            >
              {v.label}
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-1 rounded-full border border-border bg-background/95 backdrop-blur shadow-elegant px-2 py-1.5">
        <Layout className="h-3.5 w-3.5 text-primary ml-1.5 mr-0.5" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mr-1">Header</span>
        {HEADERS.map((h) => {
          const active = headerVariant === h.id;
          return (
            <button
              key={h.id}
              type="button"
              onClick={() => setHeaderVariant(h.id)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                active ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {h.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
