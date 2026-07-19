import type { Metadata } from "next";
import ImpressumContent from "@/components/moore/ImpressumContent";

export const metadata: Metadata = {
  title: "Juridisk informasjon",
  description: "Hvem som står bak mooreub.no, og hvem som er ansvarlig for innholdet.",
  robots: { index: false },
};

export default function ImpressumPage() {
  return <ImpressumContent />;
}
