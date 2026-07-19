"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/moore-i18n";

const STORAGE_KEY = "moore-cookie-notice";

/**
 * Informations-Banner, kein Consent-Manager: Die Seite setzt ausschließlich
 * technisch notwendige Cookies/Storage (Sprachwahl, Login-Session im Backend),
 * kein Tracking — es gibt also nichts einzuwilligen, nur zu informieren.
 */
export default function CookieNotice() {
  const { lang } = useLang();
  const no = lang === "no";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {}
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-notice" role="region" aria-label={no ? "Informasjonskapsler" : "Cookies"}>
      <p>
        {no ? (
          <>
            Denne nettsiden bruker kun teknisk nødvendige informasjonskapsler og lokal lagring
            (språkvalg, innlogging for redaksjonen) — ingen sporing, ingen analyse. Les mer i vår{" "}
            <Link href="/personvern">personvernerklæring</Link>.
          </>
        ) : (
          <>
            This website only uses technically necessary cookies and local storage (language
            preference, editor login) — no tracking, no analytics. Read more in our{" "}
            <Link href="/personvern">privacy policy</Link>.
          </>
        )}
      </p>
      <button onClick={dismiss} className="cookie-notice-btn">
        {no ? "Greit" : "OK"}
      </button>
    </div>
  );
}
