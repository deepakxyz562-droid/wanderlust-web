import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.asset.json";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/tours", label: "Tours" },
  { to: "/destinations", label: "Destinations" },
  { to: "/blog", label: "Travel Journal" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gold after:transition-all hover:after:w-full"
              activeProps={{ className: "text-primary after:w-full" }}
            >
              {n.label}
            </Link>
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
          <nav className="container-page py-4 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-md text-sm font-medium hover:bg-accent"
                activeProps={{ className: "bg-accent text-primary" }}
              >
                {n.label}
              </Link>
            ))}
            <Button asChild className="mt-2 bg-primary text-primary-foreground">
              <Link to="/contact" onClick={() => setOpen(false)}>Plan My Trip</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
