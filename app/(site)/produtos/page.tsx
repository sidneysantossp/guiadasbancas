import { redirect } from "next/navigation";

export default function ProdutosPage() {
  redirect("/buscar");
}

export const metadata = {
  title: "Produtos - Guia das Bancas",
  description: "Busque e encontre os melhores produtos nas bancas próximas a você.",
};
