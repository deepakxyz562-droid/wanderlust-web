import logo from "@/assets/etb-logo.png.asset.json";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { EUROPE_COUNTRIES, TOUR_CATEGORIES, TRAVEL_STYLES } from "@/lib/menu";

export function HeaderModern() {
  const { settings } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    document.body.style.overflow = overlay ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [overlay]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate({ to: "/tours", search: { q: q.trim() } });
    setOverlay(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/60">
        <div className="w-full px-6 lg:px-12 flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src={settings.logoUrl || logo.url} alt={settings.name} className="h-[52px] w-auto object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-secondary/70 border border-border/60">
            <PillLink to="/">Home</PillLink>
            <PillLink to="/tours">Tours</PillLink>
            <PillLink to="/destinations">Places</PillLink>
            <PillLink to="/blog">Journal</PillLink>
            <PillLink to="/about">Studio</PillLink>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOverlay(true)}
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-xs font-medium text-foreground/70 hover:text-primary hover:border-primary transition"
            >
              <Search className="h-3.5 w-3.5" /> Search
              <kbd className="hidden xl:inline ml-2 px-1.5 py-0.5 rounded bg-muted text-[10px]">⌘K</kbd>
            </button>
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition group"
            >
              Let's talk
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2 rounded-full hover:bg-accent" aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="px-6 py-4 flex flex-col gap-1">
              {[
                { to: "/", l: "Home" },
                { to: "/tours", l: "Tours" },
                { to: "/destinations", l: "Places" },
                { to: "/blog", l: "Journal" },
                { to: "/about", l: "Studio" },
                { to: "/contact", l: "Contact" },
              ].map((i) => (
                <Link key={i.to} to={i.to} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-accent text-sm font-medium">
                  {i.l}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {overlay && (
        <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl animate-in fade-in">
          <div className="w-full px-6 lg:px-12 pt-8 flex justify-end">
            <button onClick={() => setOverlay(false)} className="p-2 rounded-full hover:bg-accent" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="max-w-3xl mx-auto px-6 pt-12">
            <form onSubmit={submit} className="flex items-center gap-3 border-b-2 border-foreground pb-3">
              <Search className="h-6 w-6 text-foreground/60" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search a destination, tour, or experience…"
                className="bg-transparent text-2xl md:text-3xl flex-1 focus:outline-none placeholder:text-foreground/30"
              />
            </form>
            <div className="grid md:grid-cols-2 gap-10 mt-10">
              <div>
                <h3 className="text-xs uppercase tracking-[0.25em] text-foreground/50 mb-4">Destinations</h3>
                <div className="flex flex-wrap gap-2">
                  {EUROPE_COUNTRIES.slice(0, 8).map((c) => (
                    <Link key={c.slug} to="/destinations/$slug" params={{ slug: c.slug }} onClick={() => setOverlay(false)} className="px-3 py-1.5 rounded-full border border-border hover:bg-foreground hover:text-background text-sm transition">
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.25em] text-foreground/50 mb-4">Travel styles</h3>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_STYLES.slice(0, 8).map((s) => (
                    <Link key={s.slug} to="/travel-styles/$style" params={{ style: s.slug }} onClick={() => setOverlay(false)} className="px-3 py-1.5 rounded-full border border-border hover:bg-foreground hover:text-background text-sm transition">
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PillLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="px-4 py-1.5 text-sm font-medium rounded-full text-foreground/70 hover:text-foreground transition-colors"
      activeProps={{ className: "bg-background shadow-sm text-foreground" }}
      activeOptions={{ exact: to === "/" }}
    >
      {children}
    </Link>
  );
}
