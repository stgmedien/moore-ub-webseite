"use client";

import Image from "next/image";
import Link from "next/link";
import ContactWizard from "@/components/moore/ContactWizard";
import { useLang } from "@/lib/moore-i18n";

function CrossSectionSmall() {
  return (
    <svg width="300" height="300" viewBox="0 0 300 300">
      <circle cx="150" cy="150" r="128" fill="none" stroke="#10181d" strokeWidth="2" />
      <circle cx="150" cy="150" r="118" fill="none" stroke="rgba(16,24,29,0.3)" strokeWidth="1" />
      <g
        style={{
          animation: "mo-rotate 90s linear infinite",
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      >
        {[
          [228, 150],
          [205, 205],
          [150, 228],
          [95, 205],
          [72, 150],
          [95, 95],
          [150, 72],
          [205, 95],
        ].map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="36"
            fill="#ffffff"
            stroke="#10181d"
            strokeWidth="1.4"
          />
        ))}
      </g>
      <circle cx="150" cy="150" r="34" fill="#10181d" />
      <circle
        cx="150"
        cy="150"
        r="34"
        fill="none"
        stroke="#ED4F3E"
        strokeWidth="1.5"
        style={{
          animation: "mo-pulse 2.6s ease-out infinite",
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      />
      <rect x="146.5" y="128" width="7" height="44" fill="#ED4F3E" />
    </svg>
  );
}

export default function HomeContent() {
  const { lang } = useLang();
  const no = lang === "no";

  return (
    <>
      <section className="hero">
        <Image
          src="/hero-bollard.png"
          alt={no ? "Fortøyningstrosse rundt pullert i havn" : "Mooring line around a bollard"}
          fill
          preload
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "45% 62%" }}
        />
        <div className="hero-shade" />
        {/* backdrop-filter inline: the Tailwind/LightningCSS pipeline drops the
            stylesheet declaration, inline styles survive it. */}
        <div
          className="hero-blur"
          style={{
            backdropFilter: "blur(14px) saturate(1.4)",
            WebkitBackdropFilter: "blur(14px) saturate(1.4)",
          }}
        />
        <div className="moore-container hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">
              {no
                ? "SPORBARE FORTØYNINGSTROSSER — TRONDHEIM, NORGE"
                : "TRACEABLE MOORING LINES — TRONDHEIM, NORWAY"}
            </div>
            <h1>
              {no ? (
                <>
                  Digitalt <span className="hl-red">sporbare</span> trosser for en moderne
                  sjøfart.
                </>
              ) : (
                <>
                  Digitally <span className="hl-red">traceable</span> mooring lines for a modern
                  maritime industry.
                </>
              )}
            </h1>
            <p>
              {no
                ? "Moore UB gjør tau identifiserbare. En sporingsstripe i kjernen gir hver trosse en digital identitet — med spesifikasjoner og historikk tilgjengelig på sekunder."
                : "Moore UB makes rope identifiable. A tracking stripe in the core gives every mooring line a digital identity — specifications and history available in seconds."}
            </p>
            <div className="hero-actions">
              <Link href="/produkt" className="btn btn-red">
                {no ? "Se løsningen" : "See the solution"}
              </Link>
              <Link href="/kontakt" className="btn btn-outline-light">
                {no ? "Kontakt oss" : "Contact us"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="rope-divider">
          <Image
            src="/rope-cutout-hard.png"
            alt=""
            width={1921}
            height={1080}
            sizes="100vw"
          />
        </div>
        <div className="moore-container stats-inner">
          <div className="section-head" style={{ marginBottom: 56 }}>
            <span className="kicker" style={{ color: "#38D9C8" }}>
              {no ? "PROBLEMET" : "THE PROBLEM"}
            </span>
          </div>
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-value">{no ? "81 000 000" : "81,000,000"}</div>
              <p>
                {no
                  ? "meter tau kastes unødvendig hvert år."
                  : "metres of rope are discarded unnecessarily every year."}
              </p>
            </div>
            <div className="stat">
              <div className="stat-value">
                {no ? "2,0" : "2.0"}
                <span className="x">×</span>
              </div>
              <p>
                {no
                  ? "runder rundt jorden — det tilsvarer den årlige sløsingen."
                  : "trips around the Earth — the equivalent of the yearly waste."}
              </p>
            </div>
            <div className="stat">
              <div className="stat-value">
                {no ? "18,4" : "18.4"} <span className="unit">{no ? "MRD" : "BN"}</span>
              </div>
              <p>
                {no
                  ? "kroner brukes på unødvendig forbruk av tau."
                  : "NOK is spent on unnecessary rope consumption."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="moore-container" style={{ paddingTop: 72, paddingBottom: 88 }}>
          <div className="section-head" style={{ marginBottom: 56 }}>
            <span className="kicker">{no ? "LØSNINGEN" : "THE SOLUTION"}</span>
          </div>
          <div className="split-grid">
            <div>
              <div className="diagram-card">
                <CrossSectionSmall />
              </div>
              <div className="diagram-caption">
                <span>{no ? "TVERRSNITT AV TROSSE" : "ROPE CROSS-SECTION"}</span>
                <span className="id">{no ? "■ ID-STRIPE" : "■ ID STRIPE"}</span>
              </div>
            </div>
            <div className="solution-copy">
              <h2>MOORE ID</h2>
              <p>
                {no
                  ? "En sporingsstripe integreres i kjernen av fortøyningstrossen. Resultatet er en brukervennlig, digital løsning for identifikasjon, overvåkning og samsvar med kommende regelverk."
                  : "A tracking stripe is integrated into the core of the mooring line. The result is a user-friendly, digital solution for identification, monitoring and compliance with upcoming regulations."}
              </p>
              <div className="feature-grid">
                <div className="feature">
                  <div className="feature-title">{no ? "Effektivitet" : "Efficiency"}</div>
                  <p>
                    {no
                      ? "Identifiser trossen på sekunder — uten merkelapper eller gjetting."
                      : "Identify the line in seconds — no tags, no guesswork."}
                  </p>
                </div>
                <div className="feature">
                  <div className="feature-title">{no ? "Robusthet" : "Robustness"}</div>
                  <p>
                    {no
                      ? "Stripen ligger beskyttet i kjernen — like lenge som trossen selv."
                      : "The stripe sits protected in the core — for the life of the rope."}
                  </p>
                </div>
                <div className="feature">
                  <div className="feature-title">
                    {no ? "Regelverk & samsvar" : "Regulation & compliance"}
                  </div>
                  <p>
                    {no
                      ? "Dokumentert sporbarhet møter kommende krav til kontroll."
                      : "Documented traceability meets upcoming inspection requirements."}
                  </p>
                </div>
                <div className="feature">
                  <div className="feature-title">{no ? "Kompatibilitet" : "Compatibility"}</div>
                  <p>
                    {no
                      ? "Integreres i standard trosser — uendret håndtering om bord."
                      : "Integrates into standard lines — unchanged handling on board."}
                  </p>
                </div>
              </div>
              <Link href="/produkt" className="arrow-link" style={{ marginTop: 36 }}>
                {no ? "Se hele løsningen →" : "See the full solution →"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="moore-container" style={{ paddingTop: 80, paddingBottom: 96 }}>
          <div className="section-head" style={{ marginBottom: 56 }}>
            <span className="kicker" style={{ color: "#38D9C8" }}>
              KONTAKT
            </span>
          </div>
          <div
            className="split-grid"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
          >
            <div className="contact-copy">
              <div className="contact-person">
                <Image
                  src="/louise.jpg"
                  alt="Louise Bjørnevik-Tho"
                  width={76}
                  height={76}
                />
                <div>
                  <div className="contact-person-name">Louise Bjørnevik-Tho</div>
                  <div className="contact-person-role">
                    {no ? "DAGLIG LEDER, MOORE UB" : "GENERAL MANAGER, MOORE UB"}
                  </div>
                </div>
              </div>
              <h2>
                {no
                  ? "Hei! Jeg er Louise — skal vi ta en prat?"
                  : "Hi! I'm Louise — shall we have a chat?"}
              </h2>
              <p>
                {no ? (
                  <>
                    Fortell meg kort hva du lurer på, så svarer jeg personlig — som regel innen en
                    dag. Fire små steg, helt uforpliktende. Du når meg også direkte på{" "}
                    <a href="mailto:post@mooreub.no">post@mooreub.no</a>.
                  </>
                ) : (
                  <>
                    Tell me briefly what&apos;s on your mind and I&apos;ll reply personally —
                    usually within a day. Four small steps, no strings attached. You can also reach
                    me directly at <a href="mailto:post@mooreub.no">post@mooreub.no</a>.
                  </>
                )}
              </p>
            </div>
            <div className="wizard-frame">
              <ContactWizard />
            </div>
          </div>
        </div>
      </section>

      <section className="partners-section">
        <div className="moore-container" style={{ paddingTop: 72, paddingBottom: 88 }}>
          <div className="section-head" style={{ marginBottom: 48 }}>
            <span className="kicker">{no ? "VÅRE SAMARBEIDSPARTNERE" : "OUR PARTNERS"}</span>
          </div>
          <div className="partners-grid">
            <div className="partner">
              {/* eslint-disable-next-line @next/next/no-img-element -- small inline SVG logo */}
              <img src="/partners/boa.svg" alt="BOA" />
            </div>
            <div className="partner">
              {/* eslint-disable-next-line @next/next/no-img-element -- small inline SVG logo */}
              <img src="/partners/wilhelmsen.svg" alt="Wilhelmsen" />
            </div>
            <div className="partner">
              {/* eslint-disable-next-line @next/next/no-img-element -- small inline SVG logo */}
              <img src="/partners/ran.svg" alt="RAN" />
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="moore-container cta-band-inner">
          <h2>{no ? "Klar for sporbare trosser?" : "Ready for traceable mooring lines?"}</h2>
          <Link href="/kontakt" className="btn btn-red btn-cta">
            {no ? "Kontakt oss" : "Contact us"}
          </Link>
        </div>
      </section>
    </>
  );
}
