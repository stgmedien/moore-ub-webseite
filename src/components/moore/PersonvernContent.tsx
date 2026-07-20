"use client";

import { useLang } from "@/lib/moore-i18n";

export default function PersonvernContent() {
  const { lang } = useLang();
  const no = lang === "no";

  return (
    <>
      <section className="grid-bg page-hero">
        <div className="moore-container" style={{ paddingTop: 80, paddingBottom: 64 }}>
          <div className="eyebrow" style={{ color: "#ED4F3E" }}>
            {no ? "PERSONVERN" : "PRIVACY"}
          </div>
          <h1>{no ? "Personvernerklæring." : "Privacy policy."}</h1>
          <p className="lede" style={{ maxWidth: 620 }}>
            {no
              ? "Slik behandler Moore UB personopplysninger på denne nettsiden — kort, ærlig og uten sporing."
              : "How Moore UB processes personal data on this website — short, honest, and without tracking."}
          </p>
        </div>
      </section>

      <section>
        <div className="moore-container" style={{ paddingTop: 48, paddingBottom: 96 }}>
          <div className="moore-article">
            {no ? (
              <>
                <h2>Behandlingsansvarlig</h2>
                <p>
                  Moore UB (ungdomsbedrift ved Thora Storm videregående skole), org.nr. 837 007
                  232, Suhms gate 6, Trondheim, Norge. Spørsmål om personvern rettes til{" "}
                  <a href="mailto:post@mooreub.no">post@mooreub.no</a>.
                </p>

                <h2>Hvilke opplysninger vi behandler</h2>
                <h3>Kontaktskjemaet</h3>
                <p>
                  Når du sender oss en melding via kontaktskjemaet, behandler vi navnet ditt,
                  e-postadressen din, valgt tema, selve meldingen og språkvalget ditt. Formålet er
                  å besvare henvendelsen din (GDPR art. 6 nr. 1 bokstav b og f). Opplysningene
                  lagres i vår database hos Neon (EU, Frankfurt) og går som e-post til vårt
                  postmottak hos Domene AS (Norge). Henvendelser slettes når de er ferdig
                  behandlet, senest etter 12 måneder.
                </p>
                <h3>Drifts- og serverlogger</h3>
                <p>
                  Nettsiden driftes av Vercel Inc. (USA). Ved besøk behandles teknisk informasjon
                  som IP-adresse i driftslogger, av sikkerhets- og driftshensyn (GDPR art. 6 nr. 1
                  bokstav f). Vercel er sertifisert under EU-U.S. Data Privacy Framework og bruker
                  EUs standardkontrakter.
                </p>
                <h3>Informasjonskapsler og lokal lagring</h3>
                <p>
                  Vi bruker ingen egne sporings- eller analyseverktøy. Nettsiden lagrer kun det
                  som er teknisk nødvendig i nettleseren din: språkvalget ditt, valget om at
                  informasjonsbanneret er lukket, og — kun for redaksjonen — en
                  innloggingsøkt for publiseringsverktøyet.
                </p>
                <h3>Innebygd innhold fra tredjeparter</h3>
                <p>
                  Enkelte sider og blogginnlegg kan inneholde innebygd innhold fra plattformer
                  som YouTube, Vimeo, Instagram eller LinkedIn. Når du åpner en side med slikt
                  innhold, oppretter nettleseren din en direkte forbindelse til plattformens
                  servere. Da overføres teknisk informasjon som IP-adressen din, og plattformen
                  kan sette egne informasjonskapsler og samle inn bruksdata (analyse) etter egne
                  vilkår — også om du ikke har konto der. Grunnlaget er vår berettigede
                  interesse i å presentere innholdet vårt (GDPR art. 6 nr. 1 bokstav f). For
                  YouTube bruker vi der det er mulig den utvidede personvernmodusen
                  (youtube-nocookie.com). Enkelte av disse leverandørene behandler data i USA;
                  se den enkelte plattformens personvernerklæring for detaljer.
                </p>

                <h2>Dine rettigheter</h2>
                <p>
                  Du har rett til innsyn, retting, sletting, begrensning av behandling og til å
                  protestere mot behandlingen. Ta kontakt på{" "}
                  <a href="mailto:post@mooreub.no">post@mooreub.no</a>, så svarer vi så raskt vi
                  kan. Du kan også klage til{" "}
                  <a href="https://www.datatilsynet.no" target="_blank" rel="noreferrer">
                    Datatilsynet
                  </a>
                  .
                </p>

                <h2>Endringer</h2>
                <p>
                  Denne erklæringen kan oppdateres ved behov. Sist oppdatert: 20. juli 2026.
                </p>
              </>
            ) : (
              <>
                <h2>Data controller</h2>
                <p>
                  Moore UB (student company at Thora Storm upper secondary school), org. no. 837
                  007 232, Suhms gate 6, Trondheim, Norway. Privacy questions:{" "}
                  <a href="mailto:post@mooreub.no">post@mooreub.no</a>.
                </p>

                <h2>What data we process</h2>
                <h3>The contact form</h3>
                <p>
                  When you send us a message through the contact form, we process your name,
                  e-mail address, chosen topic, the message itself and your language preference.
                  The purpose is to answer your inquiry (GDPR Art. 6(1)(b) and (f)). The data is
                  stored in our database at Neon (EU, Frankfurt) and delivered as e-mail to our
                  mailbox at Domene AS (Norway). Inquiries are deleted once handled, at the
                  latest after 12 months.
                </p>
                <h3>Server and operations logs</h3>
                <p>
                  This website is hosted by Vercel Inc. (USA). When you visit, technical
                  information such as your IP address is processed in operational logs for
                  security and reliability (GDPR Art. 6(1)(f)). Vercel is certified under the
                  EU-U.S. Data Privacy Framework and uses EU standard contractual clauses.
                </p>
                <h3>Cookies and local storage</h3>
                <p>
                  We use no tracking or analytics tools of our own. The website only stores what
                  is technically necessary in your browser: your language preference, your
                  choice to close the information banner, and — for the editorial team only — a
                  login session for the publishing tool.
                </p>
                <h3>Embedded third-party content</h3>
                <p>
                  Some pages and blog posts may contain embedded content from platforms such as
                  YouTube, Vimeo, Instagram or LinkedIn. When you open a page with such content,
                  your browser connects directly to the platform&apos;s servers. Technical
                  information such as your IP address is transmitted, and the platform may set
                  its own cookies and collect usage data (analytics) under its own terms — even
                  if you have no account there. The legal basis is our legitimate interest in
                  presenting our content (GDPR Art. 6(1)(f)). For YouTube we use the enhanced
                  privacy mode (youtube-nocookie.com) where possible. Some of these providers
                  process data in the USA; see each platform&apos;s privacy policy for details.
                </p>

                <h2>Your rights</h2>
                <p>
                  You have the right to access, rectification, erasure, restriction of processing
                  and to object to processing. Contact us at{" "}
                  <a href="mailto:post@mooreub.no">post@mooreub.no</a>. You may also lodge a
                  complaint with the Norwegian Data Protection Authority,{" "}
                  <a href="https://www.datatilsynet.no" target="_blank" rel="noreferrer">
                    Datatilsynet
                  </a>
                  .
                </p>

                <h2>Changes</h2>
                <p>This policy may be updated when needed. Last updated: 20 July 2026.</p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
