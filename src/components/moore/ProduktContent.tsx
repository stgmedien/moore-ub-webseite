"use client";

import Link from "next/link";
import { Fragment } from "react";
import { useLang } from "@/lib/moore-i18n";

function CrossSectionLarge() {
  return (
    <svg viewBox="0 0 560 640">
      <circle cx="280" cy="310" r="192" fill="none" stroke="#10181d" strokeWidth="2" />
      <circle cx="280" cy="310" r="176" fill="none" stroke="rgba(16,24,29,0.3)" strokeWidth="1" />
      <g
        style={{
          animation: "mo-rotate 120s linear infinite",
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      >
        {[
          [402, 310],
          [366.3, 396.3],
          [280, 432],
          [193.7, 396.3],
          [158, 310],
          [193.7, 223.7],
          [280, 188],
          [366.3, 223.7],
        ].map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="48"
            fill="#f4f4f1"
            stroke="#10181d"
            strokeWidth="1.5"
          />
        ))}
      </g>
      <circle cx="280" cy="310" r="56" fill="#10181d" />
      <circle
        cx="280"
        cy="310"
        r="56"
        fill="none"
        stroke="#ED4F3E"
        strokeWidth="1.5"
        style={{
          animation: "mo-pulse 2.6s ease-out infinite",
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      />
      <rect x="276" y="266" width="8" height="88" fill="#ED4F3E" />
    </svg>
  );
}

export default function ProduktContent() {
  const { lang } = useLang();
  const no = lang === "no";

  const datasheet: Array<[string, string]> = no
    ? [
        ["PLASSERING", "I kjernen av trossen"],
        ["AVLESNING", "Gjennom kappen, med håndholdt skanner"],
        ["OVERFØRING", "Bluetooth til egenutviklet programvare"],
        ["LEVETID", "Følger trossens levetid"],
        ["HÅNDTERING", "Uendret om bord"],
      ]
    : [
        ["PLACEMENT", "In the core of the line"],
        ["READING", "Through the jacket, with a handheld scanner"],
        ["TRANSFER", "Bluetooth to purpose-built software"],
        ["LIFETIME", "Follows the life of the rope"],
        ["HANDLING", "Unchanged on board"],
      ];

  const steps: Array<[string, string]> = no
    ? [
        [
          "Stripe i kjernen",
          "Stripen integreres i kjernen under produksjon og bærer trossens unike ID. Den påvirker ikke håndteringen om bord.",
        ],
        [
          "Skann trossen",
          "En håndholdt skanner med sensor leser ID-en gjennom kappen — uten å åpne eller skade trossen.",
        ],
        [
          "Les dataene",
          "Skanneren sender ID-en via Bluetooth til vår egenutviklede programvare, som viser spesifikasjoner, alder og historikk.",
        ],
      ]
    : [
        [
          "Stripe in the core",
          "The stripe is integrated into the core during production and carries the line's unique ID. It does not affect handling on board.",
        ],
        [
          "Scan the line",
          "A handheld scanner with a sensor reads the ID through the jacket — without opening or damaging the line.",
        ],
        [
          "Read the data",
          "The scanner sends the ID via Bluetooth to our purpose-built software, showing specifications, age and history.",
        ],
      ];

  const useCases: Array<[string, string]> = no
    ? [
        [
          "Offshore & maritim",
          "Fortøyning og slep der dokumentert utstyr er avgjørende. Full historikk for hver trosse — fra produksjon til utskifting.",
        ],
        [
          "Fiskeri & akvakultur",
          "Identifiser og følg opp tauverk i anlegg og på fartøy — mindre tap, mindre marin forsøpling.",
        ],
        [
          "Industri & inspeksjon",
          "Alder, type og inspeksjonshistorikk på ett sted. Sertifisering og kontroll uten gjetting.",
        ],
      ]
    : [
        [
          "Offshore & maritime",
          "Mooring and towing where documented equipment is critical. Full history for every line — from production to replacement.",
        ],
        [
          "Fisheries & aquaculture",
          "Identify and follow up rope in farms and on vessels — less loss, less marine litter.",
        ],
        [
          "Industry & inspection",
          "Age, type and inspection history in one place. Certification and inspection without guesswork.",
        ],
      ];

  return (
    <>
      <section className="grid-bg page-hero">
        <div className="moore-container" style={{ paddingTop: 80, paddingBottom: 64 }}>
          <div className="eyebrow" style={{ color: "#ED4F3E" }}>
            {no ? "MOORE ID — TEKNOLOGIEN" : "MOORE ID — THE TECHNOLOGY"}
          </div>
          <h1>{no ? "Én stripe. Full sporbarhet." : "One stripe. Full traceability."}</h1>
          <p className="lede">
            {no
              ? "MOORE ID er en sporingsstripe som integreres i kjernen når trossen produseres. Den bærer trossens unike identitet — og leses gjennom kappen med en håndholdt skanner."
              : "MOORE ID is a tracking stripe integrated into the core when the rope is produced. It carries the line's unique identity — and is read through the jacket with a handheld scanner."}
          </p>
        </div>
      </section>

      <section>
        <div className="moore-container" style={{ paddingTop: 72, paddingBottom: 88 }}>
          <div className="section-head" style={{ marginBottom: 48 }}>
            <span className="kicker">{no ? "TVERRSNITTET" : "THE CROSS-SECTION"}</span>
          </div>
          <div
            className="split-grid"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 56 }}
          >
            <div className="xsec-box">
              <CrossSectionLarge />
              <div
                className="xsec-label"
                style={{ top: "3.44%", left: 0, right: 0, textAlign: "center" }}
              >
                {no ? "YTTERKAPPE" : "OUTER JACKET"}
              </div>
              <div
                className="xsec-line"
                style={{ left: "calc(50% - 0.5px)", top: "6.56%", width: 1, height: "11.56%" }}
              />
              <div
                className="xsec-label"
                style={{
                  top: "44.69%",
                  right: "1.43%",
                  textAlign: "right",
                  transform: "translateY(-14px)",
                }}
              >
                {no ? "KORDEL — 1 AV 8" : "STRAND — 1 OF 8"}
              </div>
              <div
                className="xsec-line"
                style={{ top: "48.36%", left: "81.43%", right: "1.43%", height: 1 }}
              />
              <div
                className="xsec-label red"
                style={{ top: "44.69%", left: "1.43%", transform: "translateY(-14px)" }}
              >
                MOORE ID-STRIPE
              </div>
              <div
                className="xsec-line red"
                style={{ top: "48.36%", left: "1.43%", width: "43.57%", height: 1 }}
              />
              <div
                className="xsec-line"
                style={{ left: "calc(50% - 0.5px)", top: "58.13%", width: 1, height: "23.13%" }}
              />
              <div
                className="xsec-label"
                style={{ top: "82.81%", left: 0, right: 0, textAlign: "center" }}
              >
                {no ? "KJERNE" : "CORE"}
              </div>
              <div className="xsec-footnote">
                {no
                  ? "TVERRSNITT — 8-SLÅTT TROSSE MED MOORE ID"
                  : "CROSS-SECTION — 8-STRAND LINE WITH MOORE ID"}
              </div>
            </div>
            <div className="xsec-copy">
              <h2>
                {no
                  ? "Beskyttet i kjernen. Lesbar utenfra."
                  : "Protected in the core. Readable from outside."}
              </h2>
              <p>
                {no
                  ? "Stripen ligger der trossen er best beskyttet — i kjernen. Den tåler saltvann, UV og slitasje like lenge som trossen selv, og krever ingen endring i hvordan trossen håndteres om bord."
                  : "The stripe sits where the rope is best protected — in the core. It withstands salt water, UV and wear for the life of the rope, and requires no change in how the line is handled on board."}
              </p>
              <div className="datasheet">
                <div className="datasheet-head">
                  <span>{no ? "DATABLAD — MOORE ID" : "DATA SHEET — MOORE ID"}</span>
                </div>
                <div className="datasheet-body">
                  {datasheet.map(([key, value]) => (
                    <Fragment key={key}>
                      <div className="datasheet-key">{key}</div>
                      <div>{value}</div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ borderTop: "1px solid rgba(16,24,29,0.16)" }}>
        <div className="moore-container" style={{ paddingTop: 72, paddingBottom: 88 }}>
          <div className="section-head" style={{ marginBottom: 12 }}>
            <span className="kicker">{no ? "SLIK FUNGERER DET" : "HOW IT WORKS"}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {steps.map(([title, body]) => (
              <div className="howto-row" key={title}>
                <div className="howto-title">{title}</div>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <div className="flow-chips">
            <div className="flow-chip filled">STRIPE</div>
            <span className="flow-arrow">→</span>
            <div className="flow-chip">{no ? "SKANNER" : "SCANNER"}</div>
            <span className="flow-arrow">→</span>
            <div className="flow-chip">BLUETOOTH</div>
            <span className="flow-arrow">→</span>
            <div className="flow-chip">{no ? "PROGRAMVARE" : "SOFTWARE"}</div>
          </div>
        </div>
      </section>

      <section style={{ borderTop: "1px solid rgba(16,24,29,0.16)" }}>
        <div className="moore-container" style={{ paddingTop: 72, paddingBottom: 88 }}>
          <div className="section-head" style={{ marginBottom: 48 }}>
            <span className="kicker">{no ? "BRUKSOMRÅDER" : "USE CASES"}</span>
          </div>
          <div className="usecase-grid">
            {useCases.map(([title, body]) => (
              <div className="usecase" key={title}>
                <div className="usecase-title">{title}</div>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="moore-container cta-band-inner">
          <h2>{no ? "Diskuter et pilotprosjekt." : "Discuss a pilot project."}</h2>
          <Link href="/kontakt" className="btn btn-red btn-cta">
            {no ? "Kontakt oss" : "Contact us"}
          </Link>
        </div>
      </section>
    </>
  );
}
