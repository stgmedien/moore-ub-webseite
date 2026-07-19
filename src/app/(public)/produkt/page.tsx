import type { Metadata } from "next";
import ProduktContent from "@/components/moore/ProduktContent";

export const metadata: Metadata = {
  title: "MOORE ID — Produkt",
  description:
    "MOORE ID er en sporingsstripe som integreres i kjernen når trossen produseres. Den bærer trossens unike identitet — og leses gjennom kappen med en håndholdt skanner.",
};

export default function ProduktPage() {
  return <ProduktContent />;
}
