<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Arbeitsweise in diesem Repo

## Git-Workflow

**Nie direkt auf `main` committen.** Für jede Änderung:

1. Branch frisch von `origin/main` abzweigen (nicht vom vorigen Feature-Branch — so
   bleiben parallele PRs unabhängig und konfliktfrei)
2. Committen, pushen, PR gegen `main` öffnen
3. Der Nutzer merged selbst

Commit-Messages und PR-Beschreibungen auf **Deutsch**. In der PR-Beschreibung nicht nur
auflisten, *was* geändert wurde, sondern auch *warum* — und was bewusst **nicht**
angefasst wurde, wenn das eine Entscheidung war.

Nachträgliche Korrekturen an einem noch offenen PR gehören als weiterer Commit auf
denselben Branch, nicht in einen neuen PR.

## Sprachen

Die öffentliche Website ist **zweisprachig: Norwegisch (primär) und Englisch**.
Umgeschaltet wird clientseitig über `useLang()` aus `src/lib/moore-i18n`; die Sprache
liegt in `localStorage` unter `moore-lang`.

- **Beide Sprachfassungen immer gleichzeitig pflegen.** Ein Text, der nur auf
  Norwegisch geändert wird, ist ein Bug.
- Blogartikel sind ebenfalls zweisprachig (`title`/`titleEn`, `contentHtml`/
  `contentHtmlEn` usw.). Fehlt die englische Fassung, wird auf die norwegische
  zurückgefallen — dieses Fallback-Muster bei neuen Feldern beibehalten.
- Code-Kommentare auf Deutsch.

## Ton der Website-Texte

Knapp, technisch, faktisch — nie werblich. Konkret vermeiden:

- Marketing-Adjektive ohne Inhalt („brukervennlig, digital løsning")
- Dreier-Aufzählungen und parallel gebaute Sätze über ein ganzes Raster hinweg
- Denselben Rhythmus mehrfach wiederholen (z. B. „Zwei Wörter. Zwei Wörter." oder
  überall „Aussage — Pointe" mit Gedankenstrich). Einzeln stark, in Serie wirkt es
  generiert.

Bei Zahlen, Preisen und Auszeichnungen: **Namen und Fakten gegen offizielle Quellen
prüfen**, nicht aus dem Kontext raten.

## Design-Prinzip (öffentliche Seite)

Die Designsprache ist bewusst **industriell: flach, scharfkantig, präzise.**

- `border-radius: 0`, 1px-Ink-Rahmen, **keine** Schlagschatten, keine Glas-/
  Blur-Effekte außerhalb des Heroes
- Keine dekorativen Idle-Animationen (dauerhaft rotierende/pulsierende Elemente
  wirken generiert und wurden bewusst entfernt)
- Mono-Font für Labels/Kicker, Versalien sparsam

Ein verworfenes Experiment mit einer schwebenden Glas-Navigation liegt zur Referenz
auf dem Branch `nav-float-experiment` — es passte nicht zu diesem Prinzip.

Struktur der Dateien: siehe Tabelle im [README](README.md).

## Vor dem Commit

- `npx tsc --noEmit` muss sauber durchlaufen
- Sichtbare Änderungen **in beiden Sprachen** im laufenden Dev-Server prüfen
  (`npm run dev`), nicht nur den Diff lesen
- Bei Layout-Änderungen zusätzlich mobil gegenprüfen

## Altlasten

Das Projekt basiert auf einem übernommenen CMS-Grundgerüst einer Skihütten-
Buchungsplattform. In `src/lib/mail/templates/` und einigen `src/lib/`-Dateien liegt
deshalb **ungenutzter Alt-Code** (Buchungen, Rechnungen, Belegungskalender), teils mit
Fremd-Branding. Er ist bewusst nicht gelöscht.

Tatsächlich versendet werden nur drei Mail-Templates: `email-verification`,
`two-factor-enabled`, `user-welcome`. Vor Änderungen an Mail-Code prüfen, ob die Datei
überhaupt importiert wird — sonst ändert man toten Code.
