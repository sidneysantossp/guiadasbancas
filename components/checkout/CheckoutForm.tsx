"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { usePhoneFormatter, useCEPFormatter, useEmailValidator, usePasswordValidator } from "@/lib/hooks";

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

      {/* Endereço de entrega */}
      {shipping !== "retirada" && (
        <div>
          <h2 className="text-base font-semibold">Endereço de entrega</h2>
          <div className="mt-3 space-y-3">
            <input
              type="text"
              placeholder="CEP"
              value={destCEP}
              onChange={(e) => setDestCEP(formatCEP(e.target.value))}
              className="w-full input"
            />
            <input
              type="text"
              placeholder="Rua"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full input"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Número"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                className="input"
              />
              <input
                type="text"
                placeholder="Complemento"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                className="input"
              />
            </div>
            <input
              type="text"
              placeholder="Bairro"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full input"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input"
              />
              <input
                type="text"
                placeholder="UF"
                value={uf}
                onChange={(e) => setUf(e.target.value.toUpperCase())}
                className="input"
                maxLength={2}
              />
            </div>
          </div>
        </div>
      )}

      {/* Método de entrega */}
      <div>
        <h2 className="text-base font-semibold">Método de entrega</h2>
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="shipping"
              value="retirada"
              checked={shipping === "retirada"}
              onChange={(e) => setShipping(e.target.value as any)}
            />
            <span>Retirada na banca</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="shipping"
              value="SEDEX"
              checked={shipping === "SEDEX"}
              onChange={(e) => setShipping(e.target.value as any)}
            />
            <span>SEDEX</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="shipping"
              value="MOTOBOY"
              checked={shipping === "MOTOBOY"}
              onChange={(e) => setShipping(e.target.value as any)}
            />
            <span>Motoboy</span>
          </label>
        </div>
      </div>

      {/* Forma de pagamento */}
      <div>
        <h2 className="text-base font-semibold">Forma de pagamento</h2>
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="pix"
              checked={payment === "pix"}
              onChange={(e) => setPayment(e.target.value)}
            />
            <span>PIX</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={payment === "card"}
              onChange={(e) => setPayment(e.target.value)}
            />
            <span>Cartão</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={payment === "cash"}
              onChange={(e) => setPayment(e.target.value)}
            />
            <span>Dinheiro</span>
          </label>
          {payment === "cash" && (
            <input
              type="text"
              placeholder="Troco para quanto?"
              value={paymentChange}
              onChange={(e) => setPaymentChange(e.target.value)}
              className="w-full input mt-2"
            />
          )}
        </div>
      </div>

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
