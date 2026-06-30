import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Menu, Phone, Search, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { EUROPE_COUNTRIES, TOUR_CATEGORIES } from "@/lib/menu";

export function HeaderAgency() {
  const { settings, whatsappLink } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate({ to: "/tours", search: { q: q.trim() } });
  };

  return (
    <header className="sticky top-0 z-50 bg-background shadow-md">
      <div className="bg-primary text-primary-foreground text-xs">
        <div className="w-full px-4 lg:px-10 flex items-center justify-between h-9 gap-4">
          <div className="flex items-center gap-4">
            <a href={`tel:${settings.phone}`} className="inline-flex items-center gap-1.5 hover:text-gold">
              <Phone className="h-3.5 w-3.5" /> {settings.phone}
            </a>
            <a href={`mailto:${settings.email}`} className="hidden sm:inline-flex items-center gap-1.5 hover:text-gold">
              <Mail className="h-3.5 w-3.5" /> {settings.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden lg:inline opacity-80">✓ 25,000+ Happy Travellers</span>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="hover:text-gold">WhatsApp Us</a>
          </div>
        </div>
      </div>

      <div className="w-full px-4 lg:px-10 flex items-center gap-6 py-3">
        <Link to="/" className="shrink-0">
          <img src={settings.logoUrl || "/etb-logo.png"} alt={settings.name} className="h-[60px] w-auto object-contain" />
        </Link>

        <form onSubmit={submit} className="hidden md:flex flex-1 max-w-2xl items-center bg-secondary rounded-full pl-5 pr-1 py-1 border border-border focus-within:ring-2 focus-within:ring-primary/30">
          <MapPin className="h-4 w-4 text-primary" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Where would you like to go? Try 'Switzerland' or 'Rail Tours'"
            className="bg-transparent text-sm px-3 py-2 flex-1 focus:outline-none"
          />
          <Button type="submit" size="sm" className="rounded-full bg-primary text-primary-foreground gap-1.5">
            <Search className="h-3.5 w-3.5" /> Search
          </Button>
        </form>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <div className="text-right hidden xl:block leading-tight">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Free Consultation</div>
            <div className="text-sm font-semibold text-primary">Get a Custom Quote</div>
          </div>
          <Button asChild className="bg-gold text-primary hover:bg-gold/90 font-semibold">
            <Link to="/contact">Get Quote</Link>
          </Button>
        </div>

        <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2 rounded-md hover:bg-accent" aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="hidden lg:block border-t border-border bg-secondary/40">
        <nav className="w-full px-4 lg:px-10 flex items-center gap-1 h-11 text-sm">
          <AgencyLink to="/tours">All Packages</AgencyLink>
          {EUROPE_COUNTRIES.slice(0, 6).map((c) => (
            <AgencyLink key={c.slug} to="/destinations/$slug" params={{ slug: c.slug }}>
              {c.label}
            </AgencyLink>
          ))}
          {TOUR_CATEGORIES.slice(0, 3).map((c) => (
            <AgencyLink key={c.slug} to="/tours/category/$category" params={{ category: c.slug }}>
              {c.label}
            </AgencyLink>
          ))}
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Agents online now
          </span>
        </nav>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="px-4 py-3 flex flex-col gap-1">
            <form onSubmit={submit} className="flex items-center bg-secondary rounded-full pl-3 pr-1 py-1 mb-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tours..." className="bg-transparent text-sm px-2 py-1 flex-1 focus:outline-none" />
            </form>
            <Link to="/tours" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-accent text-sm">All Packages</Link>
            {EUROPE_COUNTRIES.map((c) => (
              <Link key={c.slug} to="/destinations/$slug" params={{ slug: c.slug }} onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-accent text-sm">
                {c.label}
              </Link>
            ))}
            <Button asChild className="mt-3 bg-gold text-primary"><Link to="/contact" onClick={() => setOpen(false)}>Get Free Quote</Link></Button>
          </nav>
        </div>
      )}
    </header>
  );
}

function AgencyLink({ to, params, children }: { to: string; params?: Record<string, string>; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      params={params as never}
      className="px-3 py-1.5 rounded-md font-medium text-foreground/80 hover:bg-background hover:text-primary transition-colors"
      activeProps={{ className: "text-primary bg-background" }}
    >
      {children}
    </Link>
  );
}
