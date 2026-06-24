import { MessageCircle } from "lucide-react";
import { whatsappLink, SITE } from "@/lib/site";

export function WhatsAppButton({ message }: { message?: string }) {
  return (
    <a
      href={whatsappLink(message ?? `Hi ${SITE.name}, I'd love to plan a trip to Europe.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-3 shadow-gold hover:scale-105 transition-transform"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline text-sm font-medium">Chat with us</span>
    </a>
  );
}
