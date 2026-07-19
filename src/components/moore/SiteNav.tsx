"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/moore-i18n";

export default function SiteNav() {
  const { lang, setLang } = useLang();
  const no = lang === "no";
  const [open, setOpen] = useState(false);

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
    <header className="site-header">
      <div className="moore-container nav-inner">
        <Link href="/" className="brand" aria-label="Moore UB">
          {/* eslint-disable-next-line @next/next/no-img-element -- small inline SVG logo */}
          <img src="/logo.svg" alt="MOORE" />
          <span className="brand-badge">UB</span>
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
          {open ? "LUKK ✕" : "MENY ☰"}
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
