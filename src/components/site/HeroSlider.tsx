import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import heroEurope from "@/assets/hero-europe.jpg";
import destItaly from "@/assets/dest-italy.jpg";
import destParis from "@/assets/dest-paris.jpg";
import destSwitzerland from "@/assets/dest-switzerland.jpg";

type Slide = {
  image: string;
  alt: string;
  kicker: string;
  title: React.ReactNode;
  subtitle: string;
  ctaLabel: string;
  ctaTo: string;
};

const SLIDES: Slide[] = [
  {
    image: heroEurope,
    alt: "Sunset over Santorini, Greece",
    kicker: "Curated since 2008",
    title: (
      <>
        Unforgettable Journeys <br />
        <span className="text-gold-gradient">across Europe</span>
      </>
    ),
    subtitle:
      "From Mediterranean coasts to alpine peaks — escorted tours and tailor-made holidays designed by Europe specialists.",
    ctaLabel: "Explore Tours",
    ctaTo: "/tours",
  },
  {
    image: destItaly,
    alt: "Romantic streets of Italy",
    kicker: "La Dolce Vita",
    title: (
      <>
        Discover the soul of <br />
        <span className="text-gold-gradient">Italy</span>
      </>
    ),
    subtitle:
      "Rome, Florence, Venice and the Amalfi coast — timeless escapes through art, food and history.",
    ctaLabel: "Italy tours",
    ctaTo: "/tours",
  },
  {
    image: destParis,
    alt: "Eiffel Tower in Paris at dusk",
    kicker: "Romance & Elegance",
    title: (
      <>
        Wander the boulevards <br />
        <span className="text-gold-gradient">of Paris</span>
      </>
    ),
    subtitle:
      "From Champs-Élysées to Provence — curated French journeys that celebrate culture and cuisine.",
    ctaLabel: "France tours",
    ctaTo: "/tours",
  },
  {
    image: destSwitzerland,
    alt: "Swiss Alps mountain panorama",
    kicker: "Alpine Majesty",
    title: (
      <>
        Adventure awaits in <br />
        <span className="text-gold-gradient">Switzerland</span>
      </>
    ),
    subtitle:
      "Scenic rail journeys, glacier peaks and storybook villages across the heart of the Alps.",
    ctaLabel: "Swiss tours",
    ctaTo: "/tours",
  },
];

export function HeroSlider() {
  const autoplay = useRef(Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="relative h-[88vh] min-h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {SLIDES.map((s, i) => (
            <div key={i} className="relative h-full min-w-0 flex-[0_0_100%]">
              <img
                src={s.image}
                alt={s.alt}
                className="absolute inset-0 h-full w-full object-cover animate-[heroZoom_10s_ease-out_forwards]"
              />
              <div className="absolute inset-0 bg-hero-gradient" />
              <div className="relative container-page h-full flex flex-col justify-center text-white">
                <div className="max-w-2xl animate-fade-in">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold border border-white/20">
                    <Sparkles className="h-3 w-3" /> {s.kicker}
                  </span>
                  <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[1.05]">
                    {s.title}
                  </h1>
                  <p className="mt-6 text-lg md:text-xl text-white/85 max-w-xl leading-relaxed">
                    {s.subtitle}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button
                      asChild
                      size="lg"
                      className="bg-gold text-gold-foreground hover:bg-gold/90 h-12 px-6 text-base font-semibold"
                    >
                      <Link to={s.ctaTo}>
                        {s.ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="h-12 px-6 text-base bg-white/10 text-white border-white/30 hover:bg-white hover:text-primary backdrop-blur"
                    >
                      <Link to="/contact">Plan with an expert</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 grid place-items-center h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white transition"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 grid place-items-center h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white transition"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === selected ? "w-8 bg-gold" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes heroZoom {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
      `}</style>
    </section>
  );
}
