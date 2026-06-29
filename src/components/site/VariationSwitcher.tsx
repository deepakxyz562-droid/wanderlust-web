import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

const VARIATIONS = [
  { to: "/", label: "Classic" },
  { to: "/home/luxury", label: "Luxury Gold" },
  { to: "/home/agency", label: "Agency" },
  { to: "/home/modern", label: "Modern" },
] as const;

export function VariationSwitcher() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="fixed bottom-24 right-6 z-40 hidden md:flex items-center gap-1 rounded-full border border-border bg-background/95 backdrop-blur shadow-elegant px-2 py-1.5">
      <Sparkles className="h-3.5 w-3.5 text-gold ml-1.5 mr-0.5" />
      {VARIATIONS.map((v) => {
        const active = pathname === v.to;
        return (
          <Link
            key={v.to}
            to={v.to}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-foreground/70 hover:text-primary"
            }`}
          >
            {v.label}
          </Link>
        );
      })}
    </div>
  );
}
