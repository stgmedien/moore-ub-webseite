"use client";

import { useLang } from "@/lib/moore-i18n";

export default function ImpressumContent() {
  const { lang } = useLang();
  const no = lang === "no";

  return (
    <>
      <section className="grid-bg page-hero">
        <div className="moore-container" style={{ paddingTop: 80, paddingBottom: 64 }}>
          <div className="eyebrow" style={{ color: "#ED4F3E" }}>
            {no ? "JURIDISK INFORMASJON" : "LEGAL NOTICE"}
          </div>
          <h1>{no ? "Juridisk informasjon." : "Legal notice."}</h1>
          <p className="lede" style={{ maxWidth: 620 }}>
            {no
              ? "Hvem som står bak denne nettsiden, og hvem som er ansvarlig for innholdet."
              : "Who is behind this website and who is responsible for its content."}
          </p>
        </div>
      </section>

      <section>
        <div className="moore-container" style={{ paddingTop: 48, paddingBottom: 96 }}>
          <div className="moore-article">
            {no ? (
              <>
                <h2>Utgiver</h2>
                <p>
                  Moore UB — ungdomsbedrift ved Thora Storm videregående skole, registrert
                  gjennom Ungt Entreprenørskap.
                  <br />
                  Org.nr.: 837 007 232
                  <br />
                  Adresse: Suhms gate 6, Trondheim, Norge
                </p>

                <h2>Kontakt</h2>
                <p>
                  E-post: <a href="mailto:post@mooreub.no">post@mooreub.no</a>
                  <br />
                  Telefon: <a href="tel:+4791557765">+47 91 55 77 65</a>
                </p>

                <h2>Ansvarlig for innholdet</h2>
                <p>Louise Bjørnevik-Tho, daglig leder.</p>

                <h2>Drift</h2>
                <p>
                  Nettsiden driftes av Vercel Inc., 650 California St, San Francisco, CA 94108,
                  USA. E-post og domene leveres av Domene AS, Norge.
                </p>

                <h2>Ansvar</h2>
                <p>
                  Vi tilstreber at innholdet på nettsiden er korrekt og oppdatert, men kan ikke
                  garantere at all informasjon til enhver tid er fullstendig. Lenker til eksterne
                  nettsteder er kontrollert ved publisering; vi er ikke ansvarlige for innholdet
                  på eksterne sider.
                </p>
              </>
            ) : (
              <>
                <h2>Publisher</h2>
                <p>
                  Moore UB — student company (ungdomsbedrift) at Thora Storm upper secondary
                  school, registered through Junior Achievement Norway (Ungt Entreprenørskap).
                  <br />
                  Org. no.: 837 007 232
                  <br />
                  Address: Suhms gate 6, Trondheim, Norway
                </p>

                <h2>Contact</h2>
                <p>
                  E-mail: <a href="mailto:post@mooreub.no">post@mooreub.no</a>
                  <br />
                  Phone: <a href="tel:+4791557765">+47 91 55 77 65</a>
                </p>

                <h2>Responsible for content</h2>
                <p>Louise Bjørnevik-Tho, General Manager.</p>

                <h2>Hosting</h2>
                <p>
                  This website is hosted by Vercel Inc., 650 California St, San Francisco, CA
                  94108, USA. E-mail and domain services are provided by Domene AS, Norway.
                </p>

                <h2>Liability</h2>
                <p>
                  We strive to keep the content of this website accurate and up to date, but
                  cannot guarantee that all information is complete at all times. Links to
                  external websites were checked at the time of publication; we are not
                  responsible for the content of external sites.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
