"use client";

import ContactWizard from "@/components/moore/ContactWizard";
import { useLang } from "@/lib/moore-i18n";

export default function KontaktContent() {
  const { lang } = useLang();
  const no = lang === "no";

  return (
    <>
      <section className="grid-bg page-hero">
        <div className="moore-container" style={{ paddingTop: 80, paddingBottom: 64 }}>
          <div className="eyebrow" style={{ color: "#ED4F3E" }}>
            KONTAKT
          </div>
          <h1>{no ? "Ta kontakt." : "Get in touch."}</h1>
          <p className="lede" style={{ maxWidth: 560 }}>
            {no
              ? "Vil du vite mer om MOORE ID, eller diskutere et pilotprosjekt? Vi hører gjerne fra deg."
              : "Want to know more about MOORE ID, or discuss a pilot project? We would love to hear from you."}
          </p>
        </div>
      </section>

      <section>
        <div className="moore-container" style={{ paddingTop: 72, paddingBottom: 96 }}>
          <div
            className="split-grid"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 72 }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="contact-detail-row">
                <span className="contact-detail-key">{no ? "E-POST" : "E-MAIL"}</span>
                <a href="mailto:post@mooreub.no" className="contact-detail-value">
                  post@mooreub.no
                </a>
              </div>
              <div className="contact-detail-row">
                <span className="contact-detail-key">{no ? "TELEFON" : "PHONE"}</span>
                <a href="tel:+4791557765" className="contact-detail-value">
                  +47 91 55 77 65
                </a>
              </div>
              <div className="contact-detail-row">
                <span className="contact-detail-key">{no ? "LOKASJON" : "LOCATION"}</span>
                <span className="contact-detail-value">
                  Suhms gate 6
                  <br />
                  Trondheim, Norge
                </span>
              </div>
              <p className="contact-smallprint">
                {no
                  ? "MOORE UB — UNGDOMSBEDRIFT VED THORA STORM VGS. ORG.NR. 837 007 232."
                  : "MOORE UB — STUDENT COMPANY AT THORA STORM VGS. ORG.NR. 837 007 232."}
              </p>
            </div>
            <ContactWizard />
          </div>
        </div>
      </section>
    </>
  );
}
