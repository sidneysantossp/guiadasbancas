import PreVendaPageClient from "@/components/PreVendaPageClient";
import { preVendaSeed } from "@/data/pre-venda";

export default function PreVendaPage() {
  return <PreVendaPageClient initialItems={preVendaSeed} />;
}
