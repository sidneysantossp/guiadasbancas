"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { usePhoneFormatter, useCEPFormatter, useEmailValidator, usePasswordValidator } from "@/lib/hooks";
import AddressSection from "./AddressSection";
import ShippingSection from "./ShippingSection";
import PaymentSection from "./PaymentSection";
import OrderSummary from "./OrderSummary";

export default function CheckoutForm() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { formatPhone } = usePhoneFormatter();
  const { formatCEP } = useCEPFormatter();
  const { isValidEmail } = useEmailValidator();
  const { validatePassword } = usePasswordValidator();

  // Estados do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados de endereço e frete
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [complement, setComplement] = useState("");
  const [destCEP, setDestCEP] = useState("");

  // Estados de pagamento e frete
  const [shipping, setShipping] = useState<"retirada" | "SEDEX" | "MOTOBOY">("retirada");
  const [payment, setPayment] = useState("pix");
  const [paymentChange, setPaymentChange] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações básicas
    if (!name.trim()) {
      setError("Informe seu nome");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Informe um e-mail válido");
      return;
    }

    const phoneValidation = validatePassword(phone.replace(/\D/g, ''));
    if (phoneValidation.isValid === false) {
      setError(phoneValidation.error);
      return;
    }

    // Se não for retirada, validar endereço
    if (shipping !== "retirada") {
      if (!street || !houseNumber || !neighborhood || !city || !uf) {
        setError("Preencha o endereço completo para entrega");
        return;
      }
    }

    setSubmitting(true);

    try {
      // Lógica de submissão do pedido
      const payload = {
        customer: { name, email, phone },
        address: shipping === "retirada"
          ? { street: "", houseNumber: "", neighborhood: "", city: "", uf: "", complement: "", cep: "" }
          : { street, houseNumber, neighborhood, city, uf, complement, cep: destCEP },
        items: items.map(it => ({
          id: it.id,
          name: it.name,
          qty: it.qty,
          price: it.price,
          image: it.image
        })),
        shippingMethod: shipping,
        payment,
        paymentChange: payment === 'cash' ? paymentChange : undefined,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data?.ok) {
        setError(data?.error || 'Falha ao criar pedido');
        return;
      }

      // Salvar pedido e limpar carrinho
      try {
        localStorage.setItem('gb:lastOrder', JSON.stringify({
          orderId: data.orderId,
          ...payload,
        }));
      } catch {}

      clearCart();
      router.push('/minha-conta?checkout=true');

    } catch (err: any) {
      setError('Erro ao enviar pedido. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form id="checkout-form" onSubmit={handleSubmit} className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-4 space-y-4">
      {/* Seção de dados pessoais */}
      <div>
        <h2 className="text-base font-semibold">Seus dados</h2>
        <div className="mt-3 space-y-3">
          <input
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full input"
            required
          />

          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full input"
            required
          />

          <input
            type="tel"
            placeholder="(XX) XXXXX-XXXX"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            className="w-full input"
            required
          />
        </div>

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Seções modulares */}
      <AddressSection
        street={street}
        setStreet={setStreet}
        houseNumber={houseNumber}
        setHouseNumber={setHouseNumber}
        neighborhood={neighborhood}
        setNeighborhood={setNeighborhood}
        city={city}
        setCity={setCity}
        uf={uf}
        setUf={setUf}
        complement={complement}
        setComplement={setComplement}
        destCEP={destCEP}
        setDestCEP={setDestCEP}
        shipping={shipping}
      />

      <ShippingSection
        shipping={shipping}
        setShipping={setShipping}
        destCEP={destCEP}
      />

      <PaymentSection
        payment={payment}
        setPayment={setPayment}
        paymentChange={paymentChange}
        setPaymentChange={setPaymentChange}
      />

      {/* Revisar pedido */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
        <h3 className="text-sm font-semibold">Revisar pedido</h3>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
          <div className="text-gray-600">Nome</div>
          <div className="font-medium truncate">{name || "-"}</div>
          <div className="text-gray-600">E-mail</div>
          <div className="font-medium truncate">{email || "-"}</div>
          <div className="text-gray-600">Telefone</div>
          <div className="font-medium truncate">{phone || "-"}</div>
        </div>
      </div>
    </form>
  );
}
