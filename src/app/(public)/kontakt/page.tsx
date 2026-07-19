import type { Metadata } from "next";
import KontaktContent from "@/components/moore/KontaktContent";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Vil du vite mer om MOORE ID, eller diskutere et pilotprosjekt? Vi hører gjerne fra deg.",
};

export default function KontaktPage() {
  return <KontaktContent />;
}
