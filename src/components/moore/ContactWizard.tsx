"use client";

import { useState, type FormEvent } from "react";
import { useLang } from "@/lib/moore-i18n";

type Status = "idle" | "sending" | "error";

export default function ContactWizard() {
  const { lang } = useLang();
  const no = lang === "no";

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [msg, setMsg] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");

  const firstName = name.trim().split(/\s+/)[0] || (no ? "du" : "you");
  const stepLabel =
    step === 5 ? (no ? "FERDIG" : "DONE") : no ? `STEG ${step} AV 4` : `STEP ${step} OF 4`;
  const fillWidth = step === 5 ? 100 : (step - 1) * 25;

  const next1 = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) setStep(2);
  };

  const next2 = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) setStep(3);
  };

  const pickTopic = (value: string) => {
    setTopic(value);
    setStep(4);
  };

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!msg.trim() || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message: msg, lang, website }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("idle");
      setStep(5);
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setStep(1);
    setName("");
    setEmail("");
    setTopic("");
    setMsg("");
    setStatus("idle");
  };

  const mailtoFallback = (() => {
    const subject = encodeURIComponent(
      (no ? "Henvendelse" : "Inquiry") + (topic ? ` — ${topic}` : "") + (name ? ` (${name})` : "")
    );
    const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
    return `mailto:post@mooreub.no?subject=${subject}&body=${body}`;
  })();

  return (
    <div className="wizard">
      <div className="wizard-head">
        <span className="label">{no ? "SEND EN MELDING" : "SEND A MESSAGE"}</span>
        <span className="step">{stepLabel}</span>
      </div>
      <div className="wizard-progress">
        <div className="fill" style={{ width: `${fillWidth}%` }} />
      </div>
      <div className="wizard-body">
        {step === 1 && (
          <form onSubmit={next1} className="wizard-step">
            <div>
              <h3>{no ? "Hei! Hva heter du?" : "Hi! What's your name?"}</h3>
              <p className="hint">
                {no ? "Bare fornavn holder helt fint." : "Just a first name is totally fine."}
              </p>
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ola"
              className="wizard-input"
              autoComplete="name"
            />
            <div className="wizard-honeypot" aria-hidden="true">
              <label>
                Website
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </label>
            </div>
            <div className="wizard-actions" style={{ gap: 16 }}>
              <button type="submit" className="wizard-next">
                {no ? "Neste →" : "Next →"}
              </button>
              <span className="wizard-enter-hint">
                {no ? "ELLER TRYKK ENTER ↵" : "OR PRESS ENTER ↵"}
              </span>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={next2} className="wizard-step">
            <div>
              <h3>
                {no
                  ? `Hyggelig, ${firstName}! Hvor kan vi nå deg?`
                  : `Nice to meet you, ${firstName}! Where can we reach you?`}
              </h3>
              <p className="hint">
                {no
                  ? "E-posten din brukes bare til å svare deg — ingen nyhetsbrev, lovet."
                  : "Your e-mail is only used to reply — no newsletters, promise."}
              </p>
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@epost.no"
              className="wizard-input"
              autoComplete="email"
            />
            <div className="wizard-actions">
              <button type="submit" className="wizard-next">
                {no ? "Neste →" : "Next →"}
              </button>
              <button type="button" className="wizard-ghost" onClick={() => setStep(1)}>
                {no ? "← TILBAKE" : "← BACK"}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="wizard-step">
            <div>
              <h3>{no ? "Hva gjelder det?" : "What's it about?"}</h3>
              <p className="hint">
                {no
                  ? "Velg det som passer best — ikke så farlig om det ikke stemmer helt."
                  : "Pick whatever fits best — it does not have to be exact."}
              </p>
            </div>
            <div className="wizard-topics">
              <button className="wizard-topic" onClick={() => pickTopic("MOORE ID")}>
                MOORE ID
              </button>
              <button
                className="wizard-topic"
                onClick={() => pickTopic(no ? "Pilotprosjekt" : "Pilot project")}
              >
                {no ? "Pilotprosjekt" : "Pilot project"}
              </button>
              <button
                className="wizard-topic"
                onClick={() => pickTopic(no ? "Samarbeid" : "Partnership")}
              >
                {no ? "Samarbeid" : "Partnership"}
              </button>
              <button
                className="wizard-topic"
                onClick={() => pickTopic(no ? "Noe annet" : "Something else")}
              >
                {no ? "Noe annet" : "Something else"}
              </button>
            </div>
            <div className="wizard-actions">
              <button type="button" className="wizard-ghost" onClick={() => setStep(2)}>
                {no ? "← TILBAKE" : "← BACK"}
              </button>
              <button
                type="button"
                className="wizard-ghost"
                onClick={() => {
                  setTopic("");
                  setStep(4);
                }}
              >
                {no ? "HOPP OVER →" : "SKIP →"}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={send} className="wizard-step">
            <div>
              <h3>
                {no ? "Nesten i mål! Hva har du på hjertet?" : "Almost there! What's on your mind?"}
              </h3>
              <p className="hint">
                {no
                  ? "Et par setninger holder lenge. Du kan også bare si hei."
                  : "A couple of sentences is plenty. Or just say hi."}
              </p>
            </div>
            <textarea
              required
              rows={4}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="…"
              className="wizard-textarea"
            />
            {status === "error" && (
              <p className="wizard-error">
                {no ? (
                  <>
                    Noe gikk galt ved sending. Prøv igjen — eller send direkte til{" "}
                    <a href={mailtoFallback}>post@mooreub.no</a>.
                  </>
                ) : (
                  <>
                    Something went wrong. Try again — or e-mail us directly at{" "}
                    <a href={mailtoFallback}>post@mooreub.no</a>.
                  </>
                )}
              </p>
            )}
            <div className="wizard-actions">
              <button
                type="submit"
                className="wizard-next wizard-send"
                disabled={status === "sending"}
              >
                {status === "sending"
                  ? no
                    ? "Sender…"
                    : "Sending…"
                  : no
                    ? "Send meldingen →"
                    : "Send message →"}
              </button>
              <button type="button" className="wizard-ghost" onClick={() => setStep(3)}>
                {no ? "← TILBAKE" : "← BACK"}
              </button>
            </div>
          </form>
        )}

        {step === 5 && (
          <div className="wizard-step" style={{ gap: 12 }}>
            <span className="wizard-ok">— OK</span>
            <h3>
              {no
                ? `Takk, ${firstName}! Meldingen din er sendt.`
                : `Thanks, ${firstName}! Your message has been sent.`}
            </h3>
            <p className="hint" style={{ margin: 0 }}>
              {no
                ? "Louise svarer deg personlig — som regel innen en dag. Du når oss også direkte på post@mooreub.no."
                : "Louise will reply personally — usually within a day. You can also reach us directly at post@mooreub.no."}
            </p>
            <div className="wizard-actions" style={{ marginTop: 8 }}>
              <button className="wizard-ghost" onClick={reset}>
                {no ? "START PÅ NYTT" : "START OVER"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
