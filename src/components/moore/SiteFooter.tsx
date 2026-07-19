"use client";

import Link from "next/link";
import { useLang } from "@/lib/moore-i18n";

export default function SiteFooter() {
  const { lang } = useLang();
  const no = lang === "no";

  return (
    <footer className="site-footer">
      <div className="moore-container">
        <div className="footer-grid">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element -- small inline SVG logo */}
            <img src="/logo.svg" alt="MOORE" />
            <p>
              {no
                ? "Digitalt sporbare fortøyningstrosser for en moderne og bærekraftig sjøfart."
                : "Digitally traceable mooring lines for a modern and sustainable maritime industry."}
            </p>
          </div>
          <div className="footer-col">
            <span className="head">{no ? "NAVIGASJON" : "NAVIGATION"}</span>
            <Link href="/produkt">{no ? "Produkt" : "Product"}</Link>
            <Link href="/om-oss">{no ? "Om oss" : "About us"}</Link>
            <Link href="/blog">{no ? "Aktuelt" : "News"}</Link>
            <Link href="/kontakt">{no ? "Kontakt" : "Contact"}</Link>
          </div>
          <div className="footer-col">
            <span className="head">KONTAKT</span>
            <a href="mailto:post@mooreub.no">post@mooreub.no</a>
            <a href="tel:+4791557765">+47 91 55 77 65</a>
            <span className="plain">
              Suhms gate 6
              <br />
              Trondheim, Norge
            </span>
          </div>
          <div className="footer-col">
            <span className="head">{no ? "FØLG OSS" : "FOLLOW US"}</span>
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 MOORE UB — ORG.NR. 837 007 232</span>
          <span className="footer-legal">
            <Link href="/personvern">{no ? "Personvern" : "Privacy"}</Link>
            <Link href="/impressum">{no ? "Juridisk informasjon" : "Legal notice"}</Link>
          </span>
          <span>
            {no
              ? "UNGDOMSBEDRIFT — THORA STORM VGS, TRONDHEIM"
              : "STUDENT COMPANY — THORA STORM VGS, TRONDHEIM"}
          </span>
        </div>
      </div>
    </footer>
  );
}
