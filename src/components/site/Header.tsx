import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import logo from "@/assets/logo-transparent.png.asset.json";
import { Button } from "@/components/ui/button";
import { SITE, whatsappLink } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";
import { FEATURED_COUNTRIES, TOUR_CATEGORIES, TRAVEL_STYLES } from "@/lib/menu";

const SIMPLE_LINKS = [
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Live destinations from the DB; fall back to featured list if empty.
  const { data: destinations } = useQuery({
    queryKey: ["nav", "destinations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("title,slug")
        .eq("is_published", true)
        .order("title");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
  const countryItems =
    destinations && destinations.length > 0
      ? destinations.map((d) => ({ slug: d.slug, label: d.title }))
      : FEATURED_COUNTRIES;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur border-b border-border shadow-sm"
          : "bg-background/70 backdrop-blur-sm"
      }`}
    >
      <div className="container-page flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-3" aria-label={SITE.name}>
          <img src={logo.url} alt={SITE.name} width={48} height={48} className="h-12 w-12 object-contain" />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-display text-lg font-bold text-primary tracking-tight">EUROPE</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Tourism Bureau</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <NavLink to="/">Home</NavLink>

          <MegaDropdown label="Tours" toAll="/tours" allLabel="All Tours">
            <div className="grid grid-cols-2 gap-1 w-[520px] p-3">
              {TOUR_CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  to="/tours/category/$category"
                  params={{ category: c.slug }}
                  className="rounded-lg p-3 hover:bg-accent transition-colors"
                >
                  <div className="font-medium text-sm text-foreground">{c.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.blurb}</div>
                </Link>
              ))}
            </div>
          </MegaDropdown>

          <MegaDropdown label="Destinations" toAll="/destinations" allLabel="All Destinations">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 w-[420px] p-3">
              {countryItems.slice(0, 10).map((d) => (
                <Link
                  key={d.slug}
                  to="/destinations/$slug"
                  params={{ slug: d.slug }}
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                >
                  {d.label}
                </Link>
              ))}
            </div>
          </MegaDropdown>

          <MegaDropdown label="Travel Styles">
            <div className="grid grid-cols-2 gap-1 w-[460px] p-3">
              {TRAVEL_STYLES.map((s) => (
                <Link
                  key={s.slug}
                  to="/travel-styles/$style"
                  params={{ style: s.slug }}
                  className="rounded-lg p-3 hover:bg-accent transition-colors"
                >
                  <div className="font-medium text-sm text-foreground">{s.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.blurb}</div>
                </Link>
              ))}
            </div>
          </MegaDropdown>

          {SIMPLE_LINKS.map((n) => (
            <NavLink key={n.to} to={n.to}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button asChild variant="default" className="bg-primary text-primary-foreground hover:bg-primary-glow">
            <Link to="/contact">Plan My Trip</Link>
          </Button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 rounded-md hover:bg-accent"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container-page py-3 flex flex-col gap-1">
            <MobileLink to="/" onClick={() => setOpen(false)}>Home</MobileLink>

            <MobileGroup
              label="Tours"
              isOpen={mobileExpanded === "tours"}
              onToggle={() => setMobileExpanded((p) => (p === "tours" ? null : "tours"))}
            >
              <MobileLink to="/tours" onClick={() => setOpen(false)}>All Tours</MobileLink>
              {TOUR_CATEGORIES.map((c) => (
                <MobileLink
                  key={c.slug}
                  to="/tours/category/$category"
                  params={{ category: c.slug }}
                  onClick={() => setOpen(false)}
                >
                  {c.label}
                </MobileLink>
              ))}
            </MobileGroup>

            <MobileGroup
              label="Destinations"
              isOpen={mobileExpanded === "dest"}
              onToggle={() => setMobileExpanded((p) => (p === "dest" ? null : "dest"))}
            >
              <MobileLink to="/destinations" onClick={() => setOpen(false)}>All Destinations</MobileLink>
              {countryItems.slice(0, 10).map((d) => (
                <MobileLink
                  key={d.slug}
                  to="/destinations/$slug"
                  params={{ slug: d.slug }}
                  onClick={() => setOpen(false)}
                >
                  {d.label}
                </MobileLink>
              ))}
            </MobileGroup>

            <MobileGroup
              label="Travel Styles"
              isOpen={mobileExpanded === "styles"}
              onToggle={() => setMobileExpanded((p) => (p === "styles" ? null : "styles"))}
            >
              {TRAVEL_STYLES.map((s) => (
                <MobileLink
                  key={s.slug}
                  to="/travel-styles/$style"
                  params={{ style: s.slug }}
                  onClick={() => setOpen(false)}
                >
                  {s.label}
                </MobileLink>
              ))}
            </MobileGroup>

            {SIMPLE_LINKS.map((n) => (
              <MobileLink key={n.to} to={n.to} onClick={() => setOpen(false)}>
                {n.label}
              </MobileLink>
            ))}

            <Button asChild className="mt-3 bg-primary text-primary-foreground">
              <Link to="/contact" onClick={() => setOpen(false)}>Plan My Trip</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
      activeProps={{ className: "text-primary" }}
      activeOptions={{ exact: to === "/" }}
    >
      {children}
    </Link>
  );
}

function MegaDropdown({
  label,
  toAll,
  allLabel,
  children,
}: {
  label: string;
  toAll?: string;
  allLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group">
      <button
        type="button"
        className="px-3 py-2 inline-flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
      </button>
      <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
        <div className="rounded-xl border border-border bg-popover text-popover-foreground shadow-elegant overflow-hidden">
          {toAll && (
            <Link
              to={toAll}
              className="block px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold bg-primary/95 text-primary-foreground hover:text-gold-glow"
            >
              {allLabel ?? "View all"} →
            </Link>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

function MobileLink({
  to,
  params,
  onClick,
  children,
}: {
  to: string;
  params?: Record<string, string>;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      params={params as never}
      onClick={onClick}
      className="px-3 py-2.5 rounded-md text-sm font-medium hover:bg-accent"
      activeProps={{ className: "bg-accent text-primary" }}
    >
      {children}
    </Link>
  );
}

function MobileGroup({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium hover:bg-accent"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="pl-4 flex flex-col">{children}</div>}
    </div>
  );
}
