import LoginForm from "./LoginForm";

export const metadata = { title: "Manager Login · Moore UB" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-wh-snow)] px-6">
      <div className="w-full max-w-md bg-white border border-[var(--color-wh-winter-grey)] rounded-[var(--radius-card)] p-8 shadow-[var(--shadow-float)]">
        <div className="eyebrow">Moore UB</div>
        <h1 className="text-[32px] mt-3 mb-1">Manager-Login</h1>
        <p className="text-[var(--color-wh-fg-muted)] text-sm m-0">
          Zugang nur für das Moore-UB-Team.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
