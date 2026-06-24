import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Mail, Menu, Phone, Search, X } from "lucide-react";
import logo from "@/assets/etb-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { SITE, whatsappLink } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";
import {
  ABOUT_LINKS,
  EUROPE_COUNTRIES,
  TOUR_CATEGORIES,
  TRAVEL_STYLES,
} from "@/lib/menu";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const navigate = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQ.trim();
    if (!q) return;
    navigate({ to: "/tours", search: { q } });
    setOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Live destinations (used to map country slugs that exist in the DB).
  const { data: destinations } = useQuery({
    queryKey: ["nav", "destinations"],
    queryFn: async () => {
      const { data } = await supabase
        .from("destinations")
        .select("title,slug")
        .eq("is_published", true)
        .order("title");
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Featured special offers (published + is_featured tours)
  const { data: specialOffers } = useQuery({
    queryKey: ["nav", "special-offers"],
    queryFn: async () => {
      const { data } = await supabase
        .from("tours")
        .select("title,slug")
        .eq("is_published", true)
        .eq("is_featured", true)
        .limit(6);
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const destSlugs = new Set((destinations ?? []).map((d) => d.slug));

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur border-b border-border shadow-sm"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      {/* Top bar */}
      <div className="hidden md:block bg-primary text-primary-foreground text-xs">
        <div className="w-full px-6 lg:px-10 flex items-center justify-between h-9">
          <div className="flex items-center gap-5">
            <a href={`tel:${SITE.phone}`} className="inline-flex items-center gap-1.5 hover:text-gold transition-colors">
              <Phone className="h-3.5 w-3.5" /> {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-1.5 hover:text-gold transition-colors">
              <Mail className="h-3.5 w-3.5" /> {SITE.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <form onSubmit={submitSearch} className="hidden lg:flex items-center bg-primary-foreground/10 hover:bg-primary-foreground/15 focus-within:bg-primary-foreground/20 rounded-full pl-3 pr-1 py-0.5 transition-colors">
              <Search className="h-3.5 w-3.5 text-primary-foreground/70" />
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                type="search"
                placeholder="Search tours..."
                aria-label="Search tours"
                className="bg-transparent text-xs placeholder:text-primary-foreground/60 px-2 py-1 w-44 focus:outline-none"
              />
            </form>
            <span className="hidden xl:inline text-primary-foreground/80">{SITE.tagline}</span>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">WhatsApp</a>
            <Link to="/auth" className="hover:text-gold transition-colors">Admin</Link>
          </div>
        </div>
      </div>

      <div className="w-full px-6 lg:px-10 flex items-center justify-between gap-6 py-2">
        <Link to="/" className="flex items-center shrink-0" aria-label={SITE.name}>
          <img
            src={logo.url}
            alt={SITE.name}
            className="h-[65px] w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          <MegaDropdown label="Europe Tour Packages" toAll="/tours" allLabel="All Packages">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 w-[460px] p-3">
              <Link to="/tours" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors">
                Multi Country
              </Link>
              {EUROPE_COUNTRIES.map((c) =>
                destSlugs.size === 0 || destSlugs.has(c.slug) ? (
                  <Link
                    key={c.slug}
                    to="/destinations/$slug"
                    params={{ slug: c.slug }}
                    className="rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <Link
                    key={c.slug}
                    to="/destinations"
                    className="rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    {c.label}
                  </Link>
                ),
              )}
              <Link to="/destinations" className="rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-accent transition-colors">
                More Destinations →
              </Link>
            </div>
          </MegaDropdown>

          <NavLink to="/destinations">Destinations</NavLink>

          <MegaDropdown label="Theme Tours">
            <div className="grid gap-1 w-[340px] p-3">
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

          <MegaDropdown label="Category">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 w-[560px] p-3">
              {TRAVEL_STYLES.map((s) => (
                <Link
                  key={s.slug}
                  to="/travel-styles/$style"
                  params={{ style: s.slug }}
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </MegaDropdown>

          <NavLink to="/mice">MICE</NavLink>
          <NavLink to="/etb-transports">ETB Transports</NavLink>

          <MegaDropdown label="Special Offer" toAll="/tours" allLabel="All Tours">
            <div className="grid gap-1 w-[360px] p-3">
              {(specialOffers ?? []).length === 0 && (
                <div className="px-3 py-2 text-xs text-muted-foreground">No active offers yet.</div>
              )}
              {(specialOffers ?? []).map((t) => (
                <Link
                  key={t.slug}
                  to="/tours/$slug"
                  params={{ slug: t.slug }}
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                >
                  {t.title}
                </Link>
              ))}
            </div>
          </MegaDropdown>

          <MegaDropdown label="About Us">
            <div className="grid gap-1 w-[220px] p-3">
              {ABOUT_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </MegaDropdown>
        </nav>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
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
        <div className="lg:hidden border-t border-border bg-background max-h-[80vh] overflow-y-auto">
          <nav className="w-full px-6 py-3 flex flex-col gap-1">
            <form onSubmit={submitSearch} className="flex items-center bg-secondary rounded-full pl-3 pr-1 py-1 mb-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                type="search"
                placeholder="Search tours..."
                className="bg-transparent text-sm px-2 py-1 flex-1 focus:outline-none"
              />
            </form>

            <MobileGroup
              label="Europe Tour Packages"
              isOpen={mobileExpanded === "etp"}
              onToggle={() => setMobileExpanded((p) => (p === "etp" ? null : "etp"))}
            >
              <MobileLink to="/tours" onClick={() => setOpen(false)}>Multi Country</MobileLink>
              {EUROPE_COUNTRIES.map((c) => (
                <MobileLink
                  key={c.slug}
                  to={destSlugs.has(c.slug) ? "/destinations/$slug" : "/destinations"}
                  params={destSlugs.has(c.slug) ? { slug: c.slug } : undefined}
                  onClick={() => setOpen(false)}
                >
                  {c.label}
                </MobileLink>
              ))}
              <MobileLink to="/destinations" onClick={() => setOpen(false)}>More Destinations</MobileLink>
            </MobileGroup>

            <MobileLink to="/destinations" onClick={() => setOpen(false)}>Destinations</MobileLink>

            <MobileGroup
              label="Theme Tours"
              isOpen={mobileExpanded === "theme"}
              onToggle={() => setMobileExpanded((p) => (p === "theme" ? null : "theme"))}
            >
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
              label="Category"
              isOpen={mobileExpanded === "cat"}
              onToggle={() => setMobileExpanded((p) => (p === "cat" ? null : "cat"))}
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

            <MobileLink to="/mice" onClick={() => setOpen(false)}>MICE</MobileLink>
            <MobileLink to="/etb-transports" onClick={() => setOpen(false)}>ETB Transports</MobileLink>

            <MobileGroup
              label="Special Offer"
              isOpen={mobileExpanded === "offer"}
              onToggle={() => setMobileExpanded((p) => (p === "offer" ? null : "offer"))}
            >
              {(specialOffers ?? []).map((t) => (
                <MobileLink
                  key={t.slug}
                  to="/tours/$slug"
                  params={{ slug: t.slug }}
                  onClick={() => setOpen(false)}
                >
                  {t.title}
                </MobileLink>
              ))}
            </MobileGroup>

            <MobileGroup
              label="About Us"
              isOpen={mobileExpanded === "about"}
              onToggle={() => setMobileExpanded((p) => (p === "about" ? null : "about"))}
            >
              {ABOUT_LINKS.map((l) => (
                <MobileLink key={l.to} to={l.to} onClick={() => setOpen(false)}>
                  {l.label}
                </MobileLink>
              ))}
            </MobileGroup>

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
              className="block px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] bg-primary text-primary-foreground hover:text-gold"
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
