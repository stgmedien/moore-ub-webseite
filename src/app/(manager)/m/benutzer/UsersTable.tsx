"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, KeyRound, ShieldCheck, Loader2, X, Copy, Check, RefreshCw, Mail, ChevronDown, Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  createUser,
  deleteUser,
  generatePassword,
  resetUserPassword,
  updateUserRole,
  updateUserEmail,
} from "./actions";

type Role = "customer" | "member" | "manager" | "admin";

type Row = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function UsersTable({
  rows,
  myId,
  isAdmin,
}: {
  rows: Row[];
  myId: string;
  isAdmin: boolean;
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [resetUser, setResetUser] = useState<Row | null>(null);
  const [editEmailUser, setEditEmailUser] = useState<Row | null>(null);
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);

  return (
    <>
      {isAdmin && (
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => {
              setCreateOpen(true);
              setCreatedPassword(null);
            }}
            className="inline-flex h-11 px-5 items-center gap-2 rounded-[var(--radius-btn)] bg-[var(--color-wh-deep-green)] text-[var(--color-wh-snow)] text-sm font-semibold cursor-pointer hover:bg-[var(--color-wh-deep-green-hover)]"
          >
            <Plus size={16} /> Create new user
          </button>
        </div>
      )}

      <div className="mt-6 bg-white border border-[var(--color-wh-winter-grey)] rounded-[var(--radius-card)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-wh-snow)] border-b border-[var(--color-wh-winter-grey)] text-left">
            <tr>
              <Th>Name</Th>
              <Th>E-mail</Th>
              <Th>Role</Th>
              <Th>Created</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--color-wh-fg-muted)]">
                  No users yet.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <UserRow
                key={r.id}
                row={r}
                isMe={r.id === myId}
                isAdmin={isAdmin}
                onResetClick={() => setResetUser(r)}
                onEditEmailClick={() => setEditEmailUser(r)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {createOpen && (
        <CreateUserModal
          onClose={() => setCreateOpen(false)}
          onCreated={(pw) => {
            setCreatedPassword(pw);
            setCreateOpen(false);
          }}
        />
      )}

      {createdPassword && (
        <CreatedPasswordToast
          password={createdPassword}
          onClose={() => setCreatedPassword(null)}
        />
      )}

      {resetUser && (
        <ResetPasswordModal user={resetUser} onClose={() => setResetUser(null)} />
      )}

      {editEmailUser && (
        <EditEmailModal user={editEmailUser} onClose={() => setEditEmailUser(null)} />
      )}
    </>
  );
}

const Th = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <th
    className={`px-4 py-3 text-xs uppercase tracking-wider font-semibold text-[var(--color-wh-fg-muted)] ${className}`}
  >
    {children}
  </th>
);
const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>
);

const ROLE_BADGE: Record<string, { bg: string; fg: string; label: string }> = {
  admin: { bg: "#2F4A35", fg: "#F7F7F2", label: "Admin" },
  manager: { bg: "#6FA05F", fg: "#F7F7F2", label: "Manager" },
  member: { bg: "#E7C66B", fg: "#5C4410", label: "Member" },
  customer: { bg: "#EFE6D8", fg: "#8A5A38", label: "Customer" },
};

function UserRow({
  row,
  isMe,
  isAdmin,
  onResetClick,
  onEditEmailClick,
}: {
  row: Row;
  isMe: boolean;
  isAdmin: boolean;
  onResetClick: () => void;
  onEditEmailClick: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [openRole, setOpenRole] = useState(false);

  const badge = ROLE_BADGE[row.role] ?? ROLE_BADGE.customer;

  const changeRole = (newRole: Role) => {
    setError(null);
    setOpenRole(false);
    start(async () => {
      const res = await updateUserRole({ userId: row.id, role: newRole });
      if (!res.ok) setError(res.error ?? "Error");
      router.refresh();
    });
  };

  const onDelete = () => {
    if (!confirm(`Really delete user ${row.email}?`)) return;
    setError(null);
    start(async () => {
      const res = await deleteUser(row.id);
      if (!res.ok) setError(res.error ?? "Error");
      router.refresh();
    });
  };

  return (
    <tr className="border-b border-[var(--color-wh-winter-grey)] last:border-b-0">
      <Td>
        <div className="font-semibold flex items-center gap-2">
          {row.name ?? "—"}
          {isMe && (
            <span className="text-[10px] uppercase tracking-wider bg-[var(--color-wh-deep-green)] text-[var(--color-wh-snow)] px-2 py-0.5 rounded-full">
              You
            </span>
          )}
        </div>
      </Td>
      <Td>
        <a href={`mailto:${row.email}`} className="text-[var(--color-wh-deep-green)] no-underline">
          {row.email}
        </a>
      </Td>
      <Td>
        <div className="relative inline-block">
          <button
            type="button"
            disabled={!isAdmin || isMe || pending}
            onClick={() => setOpenRole(!openRole)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full",
              !isAdmin || isMe ? "cursor-default" : "cursor-pointer hover:opacity-90"
            )}
            style={{ background: badge.bg, color: badge.fg }}
          >
            {badge.label}
            {isAdmin && !isMe && <ChevronDown size={12} />}
          </button>
          {openRole && (
            <div className="absolute left-0 top-full mt-1 z-10 bg-white border border-[var(--color-wh-winter-grey)] rounded-md shadow-[var(--shadow-float)] min-w-[140px] py-1">
              {(["admin", "manager", "member", "customer"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => changeRole(r)}
                  className={cn(
                    "w-full px-3 py-2 text-xs uppercase tracking-wider text-left hover:bg-[var(--color-wh-green-soft)] cursor-pointer",
                    r === row.role && "font-bold text-[var(--color-wh-deep-green)]"
                  )}
                >
                  {ROLE_BADGE[r].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </Td>
      <Td>
        <span className="text-xs text-[var(--color-wh-fg-muted)]">
          {new Date(row.createdAt).toLocaleDateString("en-GB")}
        </span>
      </Td>
      <Td className="text-right">
        {isAdmin ? (
          <div className="inline-flex gap-1">
            <button
              type="button"
              onClick={onEditEmailClick}
              disabled={pending}
              title="Change e-mail address"
              className="inline-flex w-9 h-9 items-center justify-center rounded-md border border-[var(--color-wh-winter-grey)] text-[var(--color-wh-deep-green)] hover:bg-[var(--color-wh-green-soft)] cursor-pointer"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={onResetClick}
              disabled={pending}
              title="Reset password"
              className="inline-flex w-9 h-9 items-center justify-center rounded-md border border-[var(--color-wh-winter-grey)] text-[var(--color-wh-deep-green)] hover:bg-[var(--color-wh-green-soft)] cursor-pointer"
            >
              <KeyRound size={14} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={pending || isMe}
              title={isMe ? "You cannot delete yourself" : "Delete user"}
              className="inline-flex w-9 h-9 items-center justify-center rounded-md border border-[var(--color-wh-sunset)]/40 text-[var(--color-wh-sunset)] hover:bg-[var(--color-wh-sunset)]/10 cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <span className="text-xs text-[var(--color-wh-fg-muted)]">—</span>
        )}
        {error && (
          <div className="text-xs text-[var(--color-wh-sunset)] mt-1 max-w-[280px]">{error}</div>
        )}
      </Td>
    </tr>
  );
}

function CreateUserModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (password: string) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"manager" | "admin">("manager");
  const [password, setPassword] = useState("");
  const [sendWelcomeMail, setSendWelcomeMail] = useState(true);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const genPw = () => {
    start(async () => {
      const pw = await generatePassword();
      setPassword(pw);
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    start(async () => {
      const res = await createUser({ name, email, role, password, sendWelcomeMail });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.refresh();
      onCreated(res.tempPassword);
    });
  };

  return (
    <div
      role="dialog"
      aria-modal
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-[560px] bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-deep)] max-h-[88vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-[var(--color-wh-winter-grey)]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={22} className="text-[var(--color-wh-deep-green)]" />
            <h2 className="m-0 text-[20px]">Create new user</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 inline-flex items-center justify-center rounded-full hover:bg-[var(--color-wh-green-soft)] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <Input id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input id="email" type="email" label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <div>
            <label className="block text-sm font-medium text-[var(--color-wh-deep-green)] mb-1.5">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {(["manager", "admin"] as const).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "h-11 px-3 text-sm font-semibold rounded-[var(--radius-md)] cursor-pointer transition-colors",
                    role === r
                      ? "bg-[var(--color-wh-deep-green)] text-[var(--color-wh-snow)]"
                      : "bg-white border border-[var(--color-wh-winter-grey)] text-[var(--color-wh-deep-green)] hover:bg-[var(--color-wh-green-soft)]"
                  )}
                >
                  {r === "admin" ? "Admin" : "Manager"}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--color-wh-fg-muted)] mt-1.5">
              <strong>Manager:</strong> full content management. <strong>Admin:</strong>
              {" "}additionally users/roles + settings.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-wh-deep-green)] mb-1.5">
              Initial password (min. 8 characters)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g. use the Generate button"
                className="flex-1 h-11 px-4 rounded-[var(--radius-md)] border border-[var(--color-wh-winter-grey)] bg-white font-mono text-sm"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={genPw}
                disabled={pending}
                className="inline-flex h-11 px-4 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-wh-deep-green)] text-[var(--color-wh-deep-green)] text-sm font-semibold cursor-pointer hover:bg-[var(--color-wh-green-soft)]"
              >
                <RefreshCw size={14} /> Generate
              </button>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={sendWelcomeMail}
              onChange={(e) => setSendWelcomeMail(e.target.checked)}
              className="mt-1 w-5 h-5 accent-[var(--color-wh-deep-green)]"
            />
            <div>
              <div className="font-semibold text-[var(--color-wh-deep-green)] flex items-center gap-1.5">
                <Mail size={14} /> Send welcome mail with credentials
              </div>
              <div className="text-xs text-[var(--color-wh-fg-muted)] mt-1">
                Sent to the e-mail above with login link, e-mail and initial password.
              </div>
            </div>
          </label>

          {error && (
            <div className="text-sm text-[var(--color-wh-sunset)] bg-[var(--color-wh-sunset)]/10 px-3 py-2 rounded-md">
              {error}
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6 border-t border-[var(--color-wh-winter-grey)] flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={pending}
            iconLeft={pending ? <Loader2 size={16} className="animate-spin" /> : null}
          >
            {pending ? "Creating..." : "Create user"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ResetPasswordModal({ user, onClose }: { user: Row; onClose: () => void }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [sendMail, setSendMail] = useState(true);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const genPw = () => {
    start(async () => {
      const pw = await generatePassword();
      setPassword(pw);
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    start(async () => {
      const res = await resetUserPassword({ userId: user.id, newPassword: password, sendMail });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSuccess(res.tempPassword);
      router.refresh();
    });
  };

  return (
    <div
      role="dialog"
      aria-modal
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget && !success) onClose();
      }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-[520px] bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-deep)] max-h-[88vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-[var(--color-wh-winter-grey)]">
          <div className="flex items-center gap-2.5">
            <KeyRound size={22} className="text-[var(--color-wh-deep-green)]" />
            <div>
              <h2 className="m-0 text-[20px]">Reset password</h2>
              <div className="text-xs text-[var(--color-wh-fg-muted)] mt-1">
                For {user.email}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 inline-flex items-center justify-center rounded-full hover:bg-[var(--color-wh-green-soft)] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="bg-[var(--color-wh-green-soft)] text-[var(--color-wh-deep-green)] rounded-md p-4">
              <div className="font-semibold mb-2 flex items-center gap-1.5">
                <Check size={16} /> Password has been updated.
              </div>
              <div className="text-sm">New password:</div>
              <div className="flex items-center gap-2 mt-2">
                <code className="flex-1 bg-white px-3 py-2 rounded font-mono text-base break-all">
                  {success}
                </code>
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(success);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="inline-flex h-10 px-3 items-center gap-1 rounded-md bg-[var(--color-wh-deep-green)] text-[var(--color-wh-snow)] text-xs font-semibold cursor-pointer"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
            <Button type="button" variant="primary" onClick={onClose} block>
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-wh-deep-green)] mb-1.5">
                  New password (min. 8 characters)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Generate or type your own"
                    className="flex-1 h-11 px-4 rounded-[var(--radius-md)] border border-[var(--color-wh-winter-grey)] bg-white font-mono text-sm"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={genPw}
                    disabled={pending}
                    className="inline-flex h-11 px-4 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-wh-deep-green)] text-[var(--color-wh-deep-green)] text-sm font-semibold cursor-pointer hover:bg-[var(--color-wh-green-soft)]"
                  >
                    <RefreshCw size={14} /> Generate
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendMail}
                  onChange={(e) => setSendMail(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-[var(--color-wh-deep-green)]"
                />
                <div>
                  <div className="font-semibold text-[var(--color-wh-deep-green)] flex items-center gap-1.5">
                    <Mail size={14} /> Send mail with new password to the user
                  </div>
                  <div className="text-xs text-[var(--color-wh-fg-muted)] mt-1">
                    Otherwise the password is shown here and you pass it on in person.
                  </div>
                </div>
              </label>

              {error && (
                <div className="text-sm text-[var(--color-wh-sunset)] bg-[var(--color-wh-sunset)]/10 px-3 py-2 rounded-md">
                  {error}
                </div>
              )}
            </div>

            <div className="p-5 sm:p-6 border-t border-[var(--color-wh-winter-grey)] flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={pending}
                iconLeft={pending ? <Loader2 size={16} className="animate-spin" /> : null}
              >
                {pending ? "Resetting..." : "Set password"}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

function EditEmailModal({ user, onClose }: { user: Row; onClose: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState(user.email);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await updateUserEmail({ userId: user.id, email });
      if (!res.ok) { setError(res.error ?? "Error"); return; }
      setDone(true);
      router.refresh();
    });
  };

  return (
    <div
      role="dialog"
      aria-modal
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-6"
      onClick={(e) => { if (e.target === e.currentTarget && !done) onClose(); }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-[480px] bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-deep)]"
      >
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-[var(--color-wh-winter-grey)]">
          <div className="flex items-center gap-2.5">
            <Pencil size={20} className="text-[var(--color-wh-deep-green)]" />
            <div>
              <h2 className="m-0 text-[20px]">Change e-mail</h2>
              <div className="text-xs text-[var(--color-wh-fg-muted)] mt-0.5">For {user.name ?? user.email}</div>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="w-9 h-9 inline-flex items-center justify-center rounded-full hover:bg-[var(--color-wh-green-soft)] cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {done ? (
            <div className="bg-[var(--color-wh-green-soft)] text-[var(--color-wh-deep-green)] rounded-md p-4 flex items-center gap-2 font-semibold">
              <Check size={16} /> E-mail has been changed to <strong>{email}</strong>.
            </div>
          ) : (
            <>
              <Input
                id="new-email"
                type="email"
                label="New e-mail address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && (
                <div className="text-sm text-[var(--color-wh-sunset)] bg-[var(--color-wh-sunset)]/10 px-3 py-2 rounded-md">
                  {error}
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-5 sm:p-6 border-t border-[var(--color-wh-winter-grey)] flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            {done ? "Close" : "Cancel"}
          </Button>
          {!done && (
            <Button type="submit" disabled={pending || email === user.email}
              iconLeft={pending ? <Loader2 size={16} className="animate-spin" /> : null}>
              {pending ? "Saving…" : "Save"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function CreatedPasswordToast({
  password,
  onClose,
}: {
  password: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-[420px] bg-white border border-[var(--color-wh-deep-green)] rounded-[var(--radius-card)] shadow-[var(--shadow-deep)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[var(--color-wh-deep-green)] font-semibold flex items-center gap-1.5">
            <Check size={16} /> User created
          </div>
          <div className="text-sm text-[var(--color-wh-fg-muted)] mt-1">
            Password set — please share it securely:
          </div>
          <div className="flex items-center gap-2 mt-2">
            <code className="flex-1 bg-[var(--color-wh-snow)] px-3 py-2 rounded font-mono text-sm break-all">
              {password}
            </code>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(password);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="inline-flex h-9 px-3 items-center gap-1 rounded-md bg-[var(--color-wh-deep-green)] text-[var(--color-wh-snow)] text-xs font-semibold cursor-pointer"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-[var(--color-wh-green-soft)] cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
