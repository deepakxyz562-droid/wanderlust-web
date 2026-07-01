import logo from "@/assets/etb-logo.png.asset.json";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { EUROPE_COUNTRIES, TOUR_CATEGORIES, ABOUT_LINKS } from "@/lib/menu";

export function HeaderLuxury() {
  const { settings } = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0B1220]/95 backdrop-blur border-b border-gold/20"
          : "bg-gradient-to-b from-[#0B1220]/85 to-transparent"
      }`}
    >
      <div className="hidden md:flex items-center justify-between w-full px-8 lg:px-14 h-9 text-[11px] tracking-[0.2em] uppercase text-ivory/70 border-b border-white/5">
        <span>Curated journeys since 1998</span>
        <a href={`tel:${settings.phone}`} className="inline-flex items-center gap-2 hover:text-gold transition">
          <Phone className="h-3 w-3" /> {settings.phone}
        </a>
      </div>

      <div className="w-full px-8 lg:px-14 flex items-center justify-between h-24">
        <Link to="/" className="flex items-center" aria-label={settings.name}>
          <img src={settings.logoUrl || logo.url} alt={settings.name} className="h-[60px] w-auto object-contain brightness-0 invert" />
        </Link>

        <nav className="hidden lg:flex items-center gap-10 text-[12px] tracking-[0.25em] uppercase text-ivory">
          <LuxLink to="/tours">Journeys</LuxLink>
          <LuxLink to="/destinations">Destinations</LuxLink>
          <LuxLink to="/blog">Stories</LuxLink>
          <LuxLink to="/about">Maison</LuxLink>
          <LuxLink to="/contact">Concierge</LuxLink>
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border border-gold text-gold hover:bg-gold hover:text-[#0B1220] transition px-5 py-2.5 text-[11px] tracking-[0.3em] uppercase"
          >
            Begin Planning
          </Link>
        </div>

        <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2 text-ivory" aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gold/20 bg-[#0B1220] text-ivory">
          <nav className="px-8 py-6 flex flex-col gap-3 text-sm tracking-[0.2em] uppercase">
            <Link to="/tours" onClick={() => setOpen(false)}>Journeys</Link>
            <Link to="/destinations" onClick={() => setOpen(false)}>Destinations</Link>
            <Link to="/blog" onClick={() => setOpen(false)}>Stories</Link>
            <Link to="/about" onClick={() => setOpen(false)}>Maison</Link>
            <Link to="/contact" onClick={() => setOpen(false)}>Concierge</Link>
            <div className="pt-3 grid grid-cols-2 gap-2 text-[11px] text-ivory/70 normal-case tracking-normal">
              {EUROPE_COUNTRIES.slice(0, 6).map((c) => (
                <Link key={c.slug} to="/destinations/$slug" params={{ slug: c.slug }} onClick={() => setOpen(false)}>
                  {c.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function LuxLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="relative py-1 hover:text-gold transition-colors after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:bg-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
      activeProps={{ className: "text-gold" }}
    >
      {children}
    </Link>
  );
}
