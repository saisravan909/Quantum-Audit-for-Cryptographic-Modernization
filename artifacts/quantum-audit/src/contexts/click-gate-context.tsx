import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { useLocation } from "wouter";
import { useUser } from "@clerk/react";

const GATED_PATTERN = /^\/(dashboard|nodes|compliance|cbom|alerts|telemetry|pipeline|handshake|risk-map|threat-clock|config-builder|assessment|cyber-intel|demo)(\/.*)?$/;
const CLICK_LIMIT = 5;
const STORAGE_KEY = "qv_clicks";
const REDIRECT_KEY = "qv_post_auth";

const ClickGateContext = createContext<null>(null);

export function ClickGateProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useUser();
  const prevLocation = useRef<string | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!isLoaded || isSignedIn) return;
    if (location === prevLocation.current) return;
    prevLocation.current = location;

    if (!GATED_PATTERN.test(location)) return;

    const current = parseInt(localStorage.getItem(STORAGE_KEY) ?? "0", 10);
    const updated = current + 1;
    localStorage.setItem(STORAGE_KEY, String(updated));

    if (updated > CLICK_LIMIT) {
      sessionStorage.setItem(REDIRECT_KEY, location);
      setLocation("/sign-in");
    }
  }, [location, isSignedIn, isLoaded, setLocation]);

  return (
    <ClickGateContext.Provider value={null}>
      {children}
    </ClickGateContext.Provider>
  );
}

export function getPostAuthRedirect(): string {
  const stored = sessionStorage.getItem(REDIRECT_KEY);
  if (stored) sessionStorage.removeItem(REDIRECT_KEY);
  return stored ?? "/dashboard";
}
