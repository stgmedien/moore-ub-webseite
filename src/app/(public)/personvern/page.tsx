import type { Metadata } from "next";
import PersonvernContent from "@/components/moore/PersonvernContent";

export const metadata: Metadata = {
  title: "Personvernerklæring",
  description:
    "Slik behandler Moore UB personopplysninger på denne nettsiden — kort, ærlig og uten sporing.",
  robots: { index: false },
};

export default function PersonvernPage() {
  return <PersonvernContent />;
}
