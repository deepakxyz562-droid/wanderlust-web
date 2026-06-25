import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { PageHeader } from "./tours";

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a little more").max(2000),
  honeypot: z.string().max(0).optional().or(z.literal("")),
});

type SearchParams = { tour?: string };

export const Route = createFileRoute("/contact")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    tour: typeof s.tour === "string" ? s.tour : undefined,
  }),
  head: () => ({
    meta: [
      { title: `Contact — ${SITE.name}` },
      { name: "description", content: "Speak with a Europe travel specialist. Personalised quotes within 24 hours." },
      { property: "og:title", content: `Contact — ${SITE.name}` },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const search = Route.useSearch();
  const { settings, whatsappLink } = useSiteSettings();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    if (parsed.data.honeypot) return; // bot
    setSubmitting(true);
    const { error } = await supabase.from("enquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject || (search.tour ? `Interest: ${search.tour}` : null),
      message: parsed.data.message,
    });
    if (error) {
      setSubmitting(false);
      toast.error("Couldn't send right now. Please try again.");
      return;
    }
    // Fire-and-forget email notification to admin
    try {
      await supabase.functions.invoke("notify-enquiry", {
        body: {
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone || null,
          subject: parsed.data.subject || (search.tour ? `Interest: ${search.tour}` : null),
          message: parsed.data.message,
        },
      });
    } catch {
      /* email is best-effort */
    }
    setSubmitting(false);
    toast.success("Thank you! We'll be in touch within 24 hours.");
    setDone(true);
    e.currentTarget.reset();
  }

  return (
    <SiteLayout>
      <PageHeader eyebrow="Contact" title="Plan your journey" subtitle="Reply within 24 hours from a Europe specialist." />
      <section className="container-page py-16 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-card p-6 shadow-card">
            <h3 className="font-display text-xl text-primary mb-4">Get in touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3"><MapPin className="h-4 w-4 text-gold mt-1" /> {settings.address}</li>
              <li className="flex items-start gap-3"><Phone className="h-4 w-4 text-gold mt-1" /> {settings.phone}</li>
              <li className="flex items-start gap-3"><Mail className="h-4 w-4 text-gold mt-1" /> {settings.email}</li>
            </ul>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
              className="mt-5 block text-center rounded-md bg-[#25D366] text-white py-2.5 text-sm font-medium hover:opacity-90">
              Chat on WhatsApp
            </a>
          </div>
        </div>
        <form onSubmit={onSubmit} className="lg:col-span-3 rounded-2xl bg-card p-8 shadow-card space-y-4">
          <input type="text" name="honeypot" autoComplete="off" tabIndex={-1} className="hidden" aria-hidden />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" required maxLength={100} />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required maxLength={255} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" maxLength={40} />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" defaultValue={search.tour ? `Interest: ${search.tour}` : ""} maxLength={150} />
            </div>
          </div>
          <div>
            <Label htmlFor="message">Tell us about your dream trip *</Label>
            <Textarea id="message" name="message" required rows={6} maxLength={2000} />
          </div>
          <Button type="submit" disabled={submitting || done} className="bg-primary text-primary-foreground hover:bg-primary-glow w-full sm:w-auto">
            <Send className="h-4 w-4 mr-2" /> {submitting ? "Sending..." : done ? "Sent" : "Send enquiry"}
          </Button>
        </form>
      </section>
    </SiteLayout>
  );
}
