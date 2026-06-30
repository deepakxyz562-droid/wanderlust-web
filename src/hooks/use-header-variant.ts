import { useEffect, useState } from "react";

export type HeaderVariant = "classic" | "luxury" | "agency" | "modern";

const KEY = "etb.headerVariant";
const EVT = "etb:header-variant-change";

export function getStoredHeaderVariant(): HeaderVariant {
  if (typeof window === "undefined") return "classic";
  const v = window.localStorage.getItem(KEY) as HeaderVariant | null;
  return v ?? "classic";
}

export function setHeaderVariant(v: HeaderVariant) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, v);
  window.dispatchEvent(new CustomEvent(EVT, { detail: v }));
}

export function useHeaderVariant(): HeaderVariant {
  const [v, setV] = useState<HeaderVariant>("classic");
  useEffect(() => {
    setV(getStoredHeaderVariant());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<HeaderVariant>).detail;
      if (detail) setV(detail);
      else setV(getStoredHeaderVariant());
    };
    window.addEventListener(EVT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return v;
}
