"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ShieldCheck,
  ShieldOff,
  KeyRound,
  Mail,
  User,
  Loader2,
  Check,
  Copy,
  Smartphone,
} from "lucide-react";
import { QRCodeCanvas as QRCode } from "qrcode.react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  changeMyPassword,
  confirmTwoFactorSetup,
  disableTwoFactor,
  logoutAndForceRelogin,
  requestEmailChange,
  startTwoFactorSetup,
  updateMyName,
} from "./actions";

type Me = {
  id: string;
  email: string;
  name: string;
  role: string;
  mustChangePassword: boolean;
  twoFactorEnabled: boolean;
  backupCodesRemaining: number;
  lastLoginAt: string | null;
};

export default function ProfileClient({ me, forced }: { me: Me; forced: boolean }) {
  return (
    <div className="mt-8 space-y-6">
      {(forced || me.mustChangePassword) && (
        <div className="bg-[var(--color-wh-sunset)]/10 border border-[var(--color-wh-sunset)]/30 rounded-[var(--radius-md)] p-4 flex items-start gap-3">
          <AlertTriangle className="text-[var(--color-wh-sunset)] shrink-0 mt-0.5" size={18} />
          <div>
            <div className="font-semibold text-[var(--color-wh-sunset)]">
              Password change required
            </div>
            <p className="text-sm text-[var(--color-wh-black)] m-0 mt-1">
              Please change your password before using other areas. As long as this
              notice is shown, you will be redirected back to this page.
            </p>
          </div>
        </div>
      )}

      <NameSection initial={me.name} />
      <PasswordSection forced={me.mustChangePassword} />
      <EmailSection currentEmail={me.email} />
      <TwoFactorSection
        enabled={me.twoFactorEnabled}
        backupRemaining={me.backupCodesRemaining}
        role={me.role}
        userEmail={me.email}
      />

      <section className="bg-white border border-[var(--color-wh-winter-grey)] rounded-[var(--radius-card)] p-6">
        <h3 className="m-0 mb-2 text-[18px]">Login activity</h3>
        <p className="m-0 text-sm text-[var(--color-wh-fg-muted)]">
          Last login:{" "}
          {me.lastLoginAt
            ? new Date(me.lastLoginAt).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "never"}
        </p>
      </section>
    </div>
  );
}

const Card = ({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <section className="bg-white border border-[var(--color-wh-winter-grey)] rounded-[var(--radius-card)] p-6">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-[var(--color-wh-green-soft)] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="m-0 text-[18px]">{title}</h3>
        {description && (
          <p className="m-0 mt-1 text-sm text-[var(--color-wh-fg-muted)] leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
    {children}
  </section>
);

function NameSection({ initial }: { initial: string }) {
  const [name, setName] = useState(initial);
  const [pending, start] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      const r = await updateMyName(name);
      if (!r.ok) setError(r.error ?? "Error");
      else {
        setSavedAt(new Date());
        router.refresh();
      }
    });
  };

  return (
    <Card icon={<User size={18} className="text-[var(--color-wh-deep-green)]" />} title="Display name">
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1" />
        <Button type="submit" disabled={pending || name === initial}>
          {pending ? <Loader2 size={16} className="animate-spin" /> : "Save"}
        </Button>
      </form>
      {savedAt && (
        <div className="mt-2 text-xs text-[var(--color-wh-deep-green)] inline-flex items-center gap-1.5">
          <Check size={12} /> Saved
        </div>
      )}
      {error && <div className="mt-2 text-sm text-[var(--color-wh-sunset)]">{error}</div>}
    </Card>
  );
}

function PasswordSection({ forced }: { forced: boolean }) {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (next.length < 8) return setError("New password: at least 8 characters.");
    if (next !== confirm) return setError("Confirmation does not match.");
    start(async () => {
      const r = await changeMyPassword({ current, next });
      if (!r.ok) {
        setError(r.error ?? "Error");
        return;
      }
      setSuccess(true);
      setCurrent("");
      setNext("");
      setConfirm("");
      router.refresh();
    });
  };

  return (
    <Card
      icon={<KeyRound size={18} className="text-[var(--color-wh-deep-green)]" />}
      title="Change password"
      description={
        forced
          ? "Your current password is valid only once — please set a new one now."
          : "Enter your current password, then the new one. The confirmation prevents typos."
      }
    >
      <form onSubmit={submit} className="space-y-3">
        <Input
          id="current"
          type="password"
          label="Current password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
        />
        <Input
          id="next"
          type="password"
          label="New password (min. 8 characters)"
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          required
          minLength={8}
        />
        <Input
          id="confirm"
          type="password"
          label="Confirm new password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={8}
        />
        {error && (
          <div className="text-sm text-[var(--color-wh-sunset)] bg-[var(--color-wh-sunset)]/10 px-3 py-2 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm text-[var(--color-wh-deep-green)] bg-[var(--color-wh-green-soft)] px-3 py-2 rounded-md inline-flex items-center gap-1.5">
            <Check size={14} /> Password changed.
          </div>
        )}
        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 size={16} className="animate-spin" /> : "Save password"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function EmailSection({ currentEmail }: { currentEmail: string }) {
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSent(false);
    start(async () => {
      const r = await requestEmailChange({ newEmail, password });
      if (!r.ok) {
        setError(r.error ?? "Error");
        return;
      }
      setSent(true);
      setNewEmail("");
      setPassword("");
    });
  };

  return (
    <Card
      icon={<Mail size={18} className="text-[var(--color-wh-deep-green)]" />}
      title="Change e-mail address"
      description="You currently sign in with this address. We send a confirmation link to the new address — the change only takes effect once you click it."
    >
      <div className="text-sm text-[var(--color-wh-fg-muted)] mb-3">
        Current: <strong className="text-[var(--color-wh-deep-green)]">{currentEmail}</strong>
      </div>
      <form onSubmit={submit} className="space-y-3">
        <Input
          id="new-email"
          type="email"
          label="New e-mail address"
          autoComplete="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          required
        />
        <Input
          id="email-pw"
          type="password"
          label="Current password (for confirmation)"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <div className="text-sm text-[var(--color-wh-sunset)] bg-[var(--color-wh-sunset)]/10 px-3 py-2 rounded-md">
            {error}
          </div>
        )}
        {sent && (
          <div className="text-sm text-[var(--color-wh-deep-green)] bg-[var(--color-wh-green-soft)] px-3 py-2 rounded-md inline-flex items-center gap-1.5">
            <Check size={14} /> A verification mail has been sent to the new address. Click
            the link there within 24 h.
          </div>
        )}
        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 size={16} className="animate-spin" /> : "Request change"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function TwoFactorSection({
  enabled,
  backupRemaining,
  role,
  userEmail,
}: {
  enabled: boolean;
  backupRemaining: number;
  role: string;
  userEmail: string;
}) {
  const router = useRouter();
  const [setupOpen, setSetupOpen] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const [otpUri, setOtpUri] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);

  const [disablePw, setDisablePw] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [disableOpen, setDisableOpen] = useState(false);

  const startSetup = () => {
    setError(null);
    start(async () => {
      const r = await startTwoFactorSetup();
      if (!r.ok) {
        setError(r.error ?? "Error");
        return;
      }
      setSecret(r.secret ?? null);
      setOtpUri(r.otpAuthUri ?? null);
      setSetupOpen(true);
    });
  };

  const confirmSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      const r = await confirmTwoFactorSetup({ code });
      if (!r.ok) {
        setError(r.error ?? "Error");
        return;
      }
      setBackupCodes(r.backupCodes ?? []);
      setSetupOpen(false);
      setSecret(null);
      setOtpUri(null);
      setCode("");
      router.refresh();
    });
  };

  const submitDisable = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      const r = await disableTwoFactor({ password: disablePw, code: disableCode });
      if (!r.ok) {
        setError(r.error ?? "Error");
        return;
      }
      setDisableOpen(false);
      setDisablePw("");
      setDisableCode("");
      router.refresh();
    });
  };

  return (
    <Card
      icon={
        enabled ? (
          <ShieldCheck size={18} className="text-[var(--color-wh-deep-green)]" />
        ) : (
          <ShieldOff size={18} className="text-[var(--color-wh-deep-green)]" />
        )
      }
      title={`Two-factor authentication — ${enabled ? "active" : "not active"}`}
      description="Protects your account in addition to the password. 6-digit code from an authenticator app (e.g. Google Authenticator, 1Password, Authy)."
    >
      {enabled ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-[var(--color-wh-deep-green)] font-semibold">
            <Check size={16} /> 2FA is active. {backupRemaining} backup codes remaining.
          </div>
          {!disableOpen ? (
            <button
              type="button"
              onClick={() => setDisableOpen(true)}
              className="inline-flex h-10 px-4 items-center gap-2 rounded-md bg-white border border-[var(--color-wh-sunset)] text-[var(--color-wh-sunset)] text-sm font-semibold cursor-pointer hover:bg-[var(--color-wh-sunset)]/10"
            >
              <ShieldOff size={14} /> Disable 2FA
            </button>
          ) : (
            <form onSubmit={submitDisable} className="space-y-3 bg-[var(--color-wh-snow)] p-4 rounded-md border border-[var(--color-wh-winter-grey)]">
              <div className="text-sm text-[var(--color-wh-fg-muted)]">
                For security: please enter your current password + 6-digit 2FA code.
              </div>
              <Input id="disable-pw" type="password" label="Current password" value={disablePw} onChange={(e) => setDisablePw(e.target.value)} required />
              <Input id="disable-code" type="text" label="2FA code" value={disableCode} onChange={(e) => setDisableCode(e.target.value)} required inputMode="numeric" placeholder="123456" />
              {error && <div className="text-sm text-[var(--color-wh-sunset)]">{error}</div>}
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="secondary" onClick={() => setDisableOpen(false)}>Cancel</Button>
                <Button type="submit" variant="danger" disabled={pending}>
                  {pending ? <Loader2 size={16} className="animate-spin" /> : "Disable 2FA"}
                </Button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {role === "admin" && (
            <div className="bg-[var(--color-wh-sunset)]/10 border border-[var(--color-wh-sunset)]/30 rounded-md p-3 text-sm">
              <strong className="text-[var(--color-wh-sunset)]">Recommendation for admins:</strong> please
              set up 2FA urgently — you have access to content, mails and user management.
            </div>
          )}

          {!setupOpen ? (
            <button
              type="button"
              onClick={startSetup}
              disabled={pending}
              className="inline-flex h-10 px-4 items-center gap-2 rounded-md bg-[var(--color-wh-deep-green)] text-[var(--color-wh-snow)] text-sm font-semibold cursor-pointer hover:bg-[var(--color-wh-deep-green-hover)]"
            >
              {pending ? <Loader2 size={14} className="animate-spin" /> : <Smartphone size={14} />}
              Set up 2FA
            </button>
          ) : (
            <div className="bg-[var(--color-wh-snow)] p-4 rounded-md border border-[var(--color-wh-winter-grey)] space-y-4">
              <div>
                <div className="font-semibold mb-2">1. Scan the QR code with your authenticator app</div>
                {otpUri && (
                  <div className="inline-block bg-white p-3 rounded">
                    <QRCode value={otpUri} size={180} />
                  </div>
                )}
                <div className="text-xs text-[var(--color-wh-fg-muted)] mt-2">
                  If you cannot scan, enter the secret manually:
                </div>
                <code className="block mt-1 text-xs font-mono bg-white px-2 py-1.5 rounded border border-[var(--color-wh-winter-grey)] break-all">
                  {secret}
                </code>
                <div className="text-xs text-[var(--color-wh-fg-muted)] mt-1">
                  Account name: <code>{userEmail}</code> · Issuer: <code>Moore UB</code>
                </div>
              </div>

              <form onSubmit={confirmSetup} className="space-y-3">
                <div>
                  <div className="font-semibold mb-2">2. Enter the 6-digit code from the app</div>
                  <Input
                    id="totp-confirm"
                    type="text"
                    inputMode="numeric"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                    required
                  />
                </div>
                {error && <div className="text-sm text-[var(--color-wh-sunset)]">{error}</div>}
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="secondary" onClick={() => setSetupOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={pending}>
                    {pending ? <Loader2 size={16} className="animate-spin" /> : "Enable 2FA"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {backupCodes && backupCodes.length > 0 && (
        <BackupCodesPanel
          codes={backupCodes}
          onClose={async () => {
            setBackupCodes(null);
            await logoutAndForceRelogin();
          }}
        />
      )}
    </Card>
  );
}

function BackupCodesPanel({
  codes,
  onClose,
}: {
  codes: string[];
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const all = codes.join("\n");
  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[520px] bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-deep)] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-[var(--color-wh-deep-green)]" size={22} />
          <h3 className="m-0 text-[20px]">2FA enabled — backup codes</h3>
        </div>
        <p className="m-0 text-sm text-[var(--color-wh-fg-muted)] leading-relaxed">
          Store these 10 codes securely <strong>now</strong> (password manager or printed
          in a drawer). Each code lets you sign in once without the authenticator app — in case
          you lose your phone.
        </p>
        <div className="bg-[var(--color-wh-snow)] border border-[var(--color-wh-winter-grey)] rounded-md p-4 grid grid-cols-2 gap-2 font-mono text-sm">
          {codes.map((c) => (
            <code key={c} className="px-2 py-1 bg-white rounded">
              {c}
            </code>
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(all);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="inline-flex h-10 px-4 items-center gap-2 rounded-md border border-[var(--color-wh-deep-green)] text-[var(--color-wh-deep-green)] text-sm font-semibold cursor-pointer"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy all"}
          </button>
          <Button type="button" onClick={onClose}>
            Got it — please sign in again
          </Button>
        </div>
      </div>
    </div>
  );
}
