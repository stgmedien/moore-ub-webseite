import { IBM_Plex_Mono } from "next/font/google";
import CookieNotice from "@/components/moore/CookieNotice";
import SiteFooter from "@/components/moore/SiteFooter";
import SiteNav from "@/components/moore/SiteNav";
import { LanguageProvider } from "@/lib/moore-i18n";
import "./moore.css";

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`moore ${plexMono.variable} flex-1 flex flex-col`}>
      <LanguageProvider>
        <SiteNav />
        <div className="nav-spacer" />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CookieNotice />
      </LanguageProvider>
    </div>
  );
}
