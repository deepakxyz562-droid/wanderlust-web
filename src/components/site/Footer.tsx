import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.asset.json";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function Footer() {
  const { settings } = useSiteSettings();
  const socials: { url: string | null; icon: any; label: string }[] = [
    { url: settings.socials.instagram, icon: Instagram, label: "Instagram" },
    { url: settings.socials.facebook, icon: Facebook, label: "Facebook" },
    { url: settings.socials.twitter, icon: Twitter, label: "Twitter" },
    { url: settings.socials.youtube, icon: Youtube, label: "YouTube" },
    { url: settings.socials.linkedin, icon: Linkedin, label: "LinkedIn" },
  ];
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container-page py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <img src={settings.logoUrl || logo.url} alt={settings.name} width={56} height={56} className="h-14 w-14 object-contain bg-white rounded-lg p-1" />
            <div>
              <div className="font-display text-lg font-bold leading-tight uppercase">{settings.name.split(" ")[0]}</div>
              <div className="text-[10px] uppercase tracking-[0.25em] opacity-80">{settings.name.split(" ").slice(1).join(" ") || settings.tagline}</div>
            </div>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">{settings.description}</p>
          <div className="flex gap-3 mt-5">
            {socials.filter((s) => s.url).map((s) => (
              <a key={s.label} href={s.url!} aria-label={s.label} className="p-2 rounded-full bg-white/10 hover:bg-gold hover:text-gold-foreground transition-colors">
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold mb-4 text-gold">Explore</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li><Link to="/tours" className="hover:text-gold">All Tours</Link></li>
            <li><Link to="/destinations" className="hover:text-gold">Destinations</Link></li>
            <li><Link to="/blog" className="hover:text-gold">Travel Journal</Link></li>
            <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold mb-4 text-gold">Support</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link to="/auth" className="hover:text-gold">Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold mb-4 text-gold">Get in touch</h4>
          <ul className="space-y-3 text-sm opacity-90">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-gold" /> {settings.address}</li>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-gold" /> {settings.phone}</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-gold" /> {settings.email}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-5 text-xs flex flex-col sm:flex-row justify-between gap-2 opacity-80">
          <span>© {new Date().getFullYear()} {settings.name}. All rights reserved.</span>
          <span>Crafted for unforgettable European journeys.</span>
        </div>
      </div>
    </footer>
  );
}
