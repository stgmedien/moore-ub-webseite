"use client";

import Link from "next/link";
import { Fragment } from "react";
import { useLang } from "@/lib/moore-i18n";

function CrossSectionLarge() {
  const cx = 280;
  const cy = 310;
  const ring = 120; // radius the strand centers sit on
  const lay = 10; // slight off-axis rotation so it doesn't read as a perfect grid
  // 8 laid strands, packed and twisted tangentially (the "lay" of the rope) —
  // deliberately not perfect circles, so it reads as a real cross-section
  // rather than a generated diagram. Static: no idle motion.
  const strands = Array.from({ length: 8 }, (_, i) => {
    const deg = i * 45 + lay;
    const rad = (deg * Math.PI) / 180;
    return {
      x: cx + ring * Math.cos(rad),
      y: cy + ring * Math.sin(rad),
      rot: deg + 90, // major axis tangential to the ring
    };
  });
  return (
    <svg viewBox="0 0 560 640">
      {/* outer jacket wall */}
      <circle cx={cx} cy={cy} r={182} fill="none" stroke="#10181d" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={170} fill="none" stroke="rgba(16,24,29,0.28)" strokeWidth="1" />
      {strands.map(({ x, y, rot }, i) => (
        <g key={i} transform={`rotate(${rot} ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx={48} ry={42} fill="#f4f4f1" stroke="#10181d" strokeWidth="1.5" />
          {/* inner yarn bundle hint */}
          <ellipse
            cx={x}
            cy={y}
            rx={32}
            ry={27}
            fill="none"
            stroke="rgba(16,24,29,0.16)"
            strokeWidth="1"
          />
        </g>
      ))}
      {/* core with the embedded MOORE ID stripe (no pulsing target motif) —
          a small, deliberate marker rather than a bar filling the core */}
      <circle cx={cx} cy={cy} r={70} fill="#10181d" />
      <rect x={cx - 3} y={cy - 19} width={6} height={38} rx={3} fill="#ED4F3E" />
      <rect x={cx - 1} y={cy - 19} width={2} height={38} rx={1} fill="rgba(255,255,255,0.3)" />
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
          "Skanneren sender ID-en trådløst til vår egenutviklede programvare, som viser spesifikasjoner, alder og historikk.",
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
          "The scanner sends the ID wirelessly to our purpose-built software, showing specifications, age and history.",
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
          "Identifiser og følg opp tauverk i anlegg og på fartøy, noe som gir mindre tap av utstyr og mindre plast i havet.",
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
          "Identify and follow up rope in farms and on vessels, which means less lost gear and less plastic in the sea.",
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
                className="xsec-label red"
                style={{ top: "44.69%", left: "1.43%", transform: "translateY(-14px)" }}
              >
                {no ? "MOORE ID-stripe" : "MOORE ID stripe"}
              </div>
              <div
                className="xsec-line red"
                style={{ top: "48.36%", left: "1.43%", width: "43.57%", height: 1 }}
              />
              <div className="xsec-footnote">
                {no
                  ? "Tverrsnitt — 8-slått trosse med MOORE ID"
                  : "Cross-section — 8-strand line with MOORE ID"}
              </div>
            </div>
            <div className="xsec-copy">
              <h2>
                {no
                  ? "Beskyttet i kjernen, lesbar gjennom kappen."
                  : "Protected in the core, readable through the jacket."}
              </h2>
              <p>
                {no
                  ? "Stripen ligger der trossen er best beskyttet — i kjernen. Den tåler saltvann, UV og slitasje gjennom hele trossens levetid, og krever ingen endring i hvordan trossen håndteres om bord."
                  : "The stripe sits where the rope is best protected — in the core. It withstands salt water, UV and wear for the life of the rope, and requires no change in how the line is handled on board."}
              </p>
              <div className="datasheet">
                <div className="datasheet-head">
                  <span>{no ? "MOORE ID — KORT FORTALT" : "MOORE ID — AT A GLANCE"}</span>
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
