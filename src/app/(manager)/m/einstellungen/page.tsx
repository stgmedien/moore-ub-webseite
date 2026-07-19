import { getSiteSettings } from "@/lib/settings";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings · Moore UB Manager" };

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-10 max-w-[820px]">
      <div className="eyebrow">Settings</div>
      <h1 className="text-[40px] mt-2 mb-1">Booking configuration</h1>
      <p className="text-[var(--color-wh-fg-muted)] m-0 mt-2">
        Values that influence booking behaviour — they take effect immediately on the customer calendar and
        the server-side availability check.
      </p>

      <div className="mt-10">
        <SettingsForm
          initial={{
            cleaningDaysAfterDeparture: settings.cleaningDaysAfterDeparture,
          }}
          updatedAt={settings.updatedAt ? new Date(settings.updatedAt).toISOString() : null}
          updatedBy={settings.updatedBy}
        />
      </div>
    </div>
  );
}
