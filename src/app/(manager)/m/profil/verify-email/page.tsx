import { verifyEmailChange } from "../actions";
import Link from "next/link";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Confirm e-mail change · Moore UB" };

type Props = { searchParams: Promise<{ id?: string; token?: string }> };

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { id, token } = await searchParams;
  const res =
    id && token
      ? await verifyEmailChange(id, token)
      : { ok: false as const, error: "Token or ID missing in the link." };

  return (
    <div className="px-8 py-16 max-w-[640px] mx-auto">
      <div className="bg-white border border-[var(--color-wh-winter-grey)] rounded-[var(--radius-card)] p-8 text-center">
        {res.ok ? (
          <>
            <CheckCircle2 className="mx-auto text-[var(--color-wh-green)]" size={56} strokeWidth={1.4} />
            <h1 className="mt-4 text-[28px]">E-mail change confirmed.</h1>
            <p className="text-[var(--color-wh-fg-muted)] mt-3">
              Your account now uses{" "}
              <strong className="text-[var(--color-wh-deep-green)]">{res.newEmail}</strong>. You
              can now sign in to the manager backend with this address.
            </p>
            <Link
              href="/m/login"
              className="inline-flex mt-6 h-12 px-6 items-center rounded-[var(--radius-btn)] bg-[var(--color-wh-deep-green)] text-[var(--color-wh-snow)] no-underline font-semibold"
            >
              Go to login
            </Link>
          </>
        ) : (
          <>
            <AlertTriangle className="mx-auto text-[var(--color-wh-sunset)]" size={56} strokeWidth={1.4} />
            <h1 className="mt-4 text-[28px]">Change failed.</h1>
            <p className="text-[var(--color-wh-fg-muted)] mt-3">{res.error}</p>
            <Link
              href="/m/profil"
              className="inline-flex mt-6 h-12 px-6 items-center rounded-[var(--radius-btn)] bg-[var(--color-wh-deep-green)] text-[var(--color-wh-snow)] no-underline font-semibold"
            >
              Back to profile
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
