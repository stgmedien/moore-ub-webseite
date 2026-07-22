"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/moore-i18n";

const TEAM = [
  { img: "/team/louise.webp", name: "Louise Bjørnevik-Tho", roleNo: "DAGLIG LEDER", roleEn: "GENERAL MANAGER" },
  { img: "/team/kornelius.webp", name: "Kornelius Bade Rygh", roleNo: "SALG & BÆREKRAFT", roleEn: "SALES & SUSTAINABILITY" },
  { img: "/team/jonathan.webp", name: "Jonathan Ulrich Seitz", roleNo: "PRODUKT & IT", roleEn: "PRODUCT & IT" },
  { img: "/team/oliver.webp", name: "Oliver Dalåmo Frivold", roleNo: "HR & ØKONOMI", roleEn: "HR & FINANCE" },
  { img: "/team/christian.webp", name: "Christian V. P. Gustavsen", roleNo: "MARKED", roleEn: "MARKETING" },
];

export type NewsItem = { date: string; title: string; href: string };

export default function OmOssContent({ news = [] }: { news?: NewsItem[] }) {
  const { lang } = useLang();
  const no = lang === "no";

  return (
    <>
      <section className="grid-bg page-hero">
        <div className="moore-container" style={{ paddingTop: 80, paddingBottom: 0 }}>
          <div className="eyebrow" style={{ color: "#ED4F3E" }}>
            {no ? "OM OSS" : "ABOUT US"}
          </div>
          <h1 style={{ maxWidth: 880, fontSize: "clamp(36px,4.6vw,60px)", lineHeight: 1.05 }}>
            {no ? (
              <>Mindre sløsing. Mer sporbarhet.</>
            ) : (
              <>
                Less waste. <span className="hl-red">MOORE</span> traceability.
              </>
            )}
          </h1>
          <p className="lede" style={{ maxWidth: 620 }}>
            {no
              ? "Moore UB er en ungdomsbedrift ved Thora Storm videregående skole i Trondheim. Vi vil gjøre den maritime industrien mer bærekraftig ved å gi tau en digital identitet — og redusere overforbruket som skyldes manglende sporbarhet."
              : "Moore UB is a student company at Thora Storm upper secondary school in Trondheim. We want to make the maritime industry more sustainable by giving rope a digital identity — reducing the overconsumption caused by missing traceability."}
          </p>
          <div className="kicker" style={{ color: "#ED4F3E", marginTop: 48 }}>
            {no ? "UTMERKELSER 2026" : "AWARDS 2026"}
          </div>
          <div className="facts-grid awards" style={{ marginTop: 20 }}>
            <div className="fact">
              <div className="fact-key">GEN-E 2026 · RIGA</div>
              <div className="fact-value">JA Europe Innovation of the Year</div>
            </div>
            <div className="fact">
              <div className="fact-key">GEN-E 2026 · RIGA</div>
              <div className="fact-value">FedEx Access Award</div>
            </div>
            <div className="fact">
              <div className="fact-key">
                {no ? "NM 2026 · NORGE" : "NATIONAL FINAL 2026 · NORWAY"}
              </div>
              <div className="fact-value">
                {no ? "Norges beste ungdomsbedrift" : "Norway's best student company"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="moore-container" style={{ paddingTop: 72, paddingBottom: 88 }}>
          <div className="section-head" style={{ marginBottom: 48 }}>
            <span className="kicker">{no ? "TEAMET" : "THE TEAM"}</span>
          </div>
          <div className="team-grid">
            {TEAM.map((member) => (
              <div className="team-card" key={member.name}>
                <div className="portrait">
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    sizes="(max-width: 760px) 50vw, 230px"
                  />
                </div>
                <div className="meta">
                  <div className="name">{member.name}</div>
                  <div className="role">{no ? member.roleNo : member.roleEn}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {news.length > 0 && (
        <section style={{ borderTop: "1px solid rgba(16,24,29,0.16)" }}>
          <div className="moore-container" style={{ paddingTop: 72, paddingBottom: 88 }}>
            <div className="section-head" style={{ marginBottom: 12 }}>
              <span className="kicker">{no ? "AKTUELT" : "NEWS"}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {news.map((item) => (
                <Link href={item.href} className="news-row" key={item.href}>
                  <span className="news-date">{item.date}</span>
                  <span className="news-title">{item.title}</span>
                  <span className="news-more">{no ? "LES MER →" : "READ MORE →"}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="cta-band">
        <div className="moore-container cta-band-inner">
          <h2>{no ? "Vil du samarbeide med oss?" : "Want to work with us?"}</h2>
          <Link href="/kontakt" className="btn btn-red btn-cta">
            {no ? "Kontakt oss" : "Contact us"}
          </Link>
        </div>
      </section>
    </>
  );
}
