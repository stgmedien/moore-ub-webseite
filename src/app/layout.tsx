import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Caveat } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

const SITE_NAME = "Moore UB — Digitalt sporbare trosser";
const SITE_DESCRIPTION =
  "Moore UB gjør tau identifiserbare. En sporingsstripe i kjernen gir hver trosse en digital identitet — med spesifikasjoner og historikk tilgjengelig på sekunder.";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: "%s | Moore UB",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    siteName: "Moore UB",
    locale: "nb_NO",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/hero-bollard.png",
        width: 1918,
        height: 820,
        alt: "Fortøyningstrosse rundt pullert i havn",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="no"
      className={`${bricolage.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
