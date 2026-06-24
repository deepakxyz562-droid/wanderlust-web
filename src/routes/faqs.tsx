import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SITE } from "@/lib/site";
import { PageHeader } from "./tours";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: `FAQs — ${SITE.name}` },
      { name: "description", content: "Frequently asked questions about booking European tours, visas, payments and travel insurance." },
      { property: "og:title", content: `FAQs — ${SITE.name}` },
      { property: "og:description", content: "Answers to common questions about booking with Europe Tourism Bureau." },
    ],
    links: [{ rel: "canonical", href: "/faqs" }],
  }),
  component: FaqsPage,
});

const FAQS = [
  { q: "How do I book a tour?", a: "Submit an enquiry via the contact page or WhatsApp us. A travel consultant will respond within 24 hours with a tailored proposal and a secure payment link." },
  { q: "Do you arrange Schengen visas?", a: "Yes. We provide visa-support documents (invitation letters, confirmed bookings, day-by-day itineraries) accepted by every Schengen consulate. Submission and biometrics remain the traveller's responsibility." },
  { q: "What is included in the tour price?", a: "Each itinerary lists exact inclusions — typically accommodation, daily breakfast, intercity transport, guided sightseeing and entrance fees. International flights and personal expenses are excluded unless stated." },
  { q: "Can the itinerary be customised?", a: "Absolutely. Every itinerary on the site is a starting template. We routinely adjust hotels, pace, free days and add experiences for honeymoons, families and small groups." },
  { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, bank transfer and UPI. Bookings are confirmed on receipt of a 25% deposit; the balance is due 45 days before departure." },
  { q: "Do you provide travel insurance?", a: "Yes. We offer comprehensive Schengen-compliant policies through partner insurers covering medical, trip cancellation and lost baggage." },
];

function FaqsPage() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Help & info" title="Frequently Asked Questions" subtitle="Everything you need to know before you travel with us." />
      <section className="container-page py-16 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-medium text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteLayout>
  );
}
