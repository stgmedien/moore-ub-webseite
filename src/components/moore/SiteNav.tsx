"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/moore-i18n";

export default function SiteNav() {
  const { lang, setLang } = useLang();
  const no = lang === "no";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Beim Scrollen löst sich die Leiste vom Rand und wird zur schwebenden
  // Glaskarte (s. .site-header.scrolled in moore.css).
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const links = (
    <>
      <Link href="/produkt">{no ? "Produkt" : "Product"}</Link>
      <Link href="/om-oss">{no ? "Om oss" : "About us"}</Link>
      <Link href="/blog">{no ? "Aktuelt" : "News"}</Link>
      <Link href="/kontakt">{no ? "Kontakt" : "Contact"}</Link>
    </>
  );

  const langToggle = (
    <div className="lang-toggle">
      <button className={`lang-btn${no ? " active" : ""}`} onClick={() => setLang("no")}>
        NO
      </button>
      <button className={`lang-btn${no ? "" : " active"}`} onClick={() => setLang("en")}>
        EN
      </button>
    </div>
  );

  return (
    <header
      className={`site-header${scrolled ? " scrolled" : ""}`}
      /* backdrop-filter inline: die Tailwind/LightningCSS-Pipeline wirft die
         Stylesheet-Deklaration teils weg, Inline-Styles überleben (s. hero-blur) */
      style={{
        backdropFilter: "blur(16px) saturate(1.25)",
        WebkitBackdropFilter: "blur(16px) saturate(1.25)",
      }}
    >
      <div className="moore-container nav-inner">
        <Link href="/" className="brand" aria-label="Moore UB">
          {/* eslint-disable-next-line @next/next/no-img-element -- small inline SVG logo */}
          <img src="/logo.svg" alt="MOORE" />
        </Link>
        <nav className="nav-links">
          {links}
          {langToggle}
        </nav>
        <button
          className="nav-burger"
          aria-expanded={open}
          aria-label={no ? "Meny" : "Menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (no ? "LUKK ✕" : "CLOSE ✕") : no ? "MENY ☰" : "MENU ☰"}
        </button>
      </div>
      {/* Clicking a link bubbles here and closes the menu before navigation. */}
      <div className={`mobile-menu${open ? " open" : ""}`} onClick={() => setOpen(false)}>
        {links}
        <div onClick={(e) => e.stopPropagation()}>{langToggle}</div>
      </div>
    </header>
  );
}
