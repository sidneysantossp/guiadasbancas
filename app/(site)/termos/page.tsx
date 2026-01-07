import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | Guia das Bancas",
  description: "Termos de Uso do Guia das Bancas - Condições para utilização da plataforma.",
};

export default function TermosPage() {
  return (
    <main className="container-max py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Termos de Uso</h1>
        <p className="text-sm text-gray-500 mb-8">Última atualização: Janeiro de 2026</p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Aceitação dos Termos</h2>
            <p className="text-gray-600 leading-relaxed">
              Ao acessar e utilizar o Guia das Bancas ("Plataforma"), você concorda com estes Termos de Uso. 
              Se não concordar com alguma condição, não utilize nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Descrição do Serviço</h2>
            <p className="text-gray-600 leading-relaxed">
              O Guia das Bancas é uma plataforma que conecta consumidores a bancas de jornal e revistarias, 
              permitindo a busca, visualização e compra de produtos. Atuamos como intermediários entre 
              compradores e vendedores (jornaleiros).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Cadastro e Conta</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Você deve fornecer informações verdadeiras e atualizadas</li>
              <li>É responsável pela segurança de sua conta e senha</li>
              <li>Deve ter pelo menos 18 anos ou autorização dos pais/responsáveis</li>
              <li>Uma pessoa pode ter apenas uma conta</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Uso da Plataforma</h2>
            <p className="text-gray-600 leading-relaxed mb-3">Ao utilizar a Plataforma, você concorda em:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Não violar leis ou regulamentos aplicáveis</li>
              <li>Não publicar conteúdo ofensivo, ilegal ou que viole direitos de terceiros</li>
              <li>Não tentar acessar sistemas sem autorização</li>
              <li>Não interferir no funcionamento da Plataforma</li>
              <li>Não utilizar robôs ou scripts automatizados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Compras e Transações</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Os preços são definidos pelos jornaleiros e podem variar</li>
              <li>A disponibilidade dos produtos está sujeita ao estoque de cada banca</li>
              <li>O Guia das Bancas não se responsabiliza por produtos vendidos por terceiros</li>
              <li>Problemas com pedidos devem ser resolvidos diretamente com a banca vendedora</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Para Jornaleiros</h2>
            <p className="text-gray-600 leading-relaxed mb-3">Jornaleiros cadastrados concordam em:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Fornecer informações precisas sobre produtos e preços</li>
              <li>Manter estoque atualizado</li>
              <li>Cumprir com os pedidos realizados</li>
              <li>Respeitar o Código de Defesa do Consumidor</li>
              <li>Pagar as taxas acordadas pelo uso da plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Propriedade Intelectual</h2>
            <p className="text-gray-600 leading-relaxed">
              Todo o conteúdo da Plataforma (textos, imagens, logos, software) é protegido por direitos autorais 
              e pertence ao Guia das Bancas ou seus licenciadores. É proibida a reprodução sem autorização.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Limitação de Responsabilidade</h2>
            <p className="text-gray-600 leading-relaxed">
              O Guia das Bancas não se responsabiliza por danos diretos, indiretos, incidentais ou consequenciais 
              resultantes do uso ou impossibilidade de uso da Plataforma. Não garantimos que o serviço será 
              ininterrupto ou livre de erros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Modificações</h2>
            <p className="text-gray-600 leading-relaxed">
              Podemos modificar estes Termos a qualquer momento. Alterações significativas serão comunicadas 
              através da Plataforma. O uso continuado após as alterações implica aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Rescisão</h2>
            <p className="text-gray-600 leading-relaxed">
              Podemos suspender ou encerrar seu acesso à Plataforma a qualquer momento, por violação destes 
              Termos ou por qualquer outro motivo, sem aviso prévio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">11. Lei Aplicável</h2>
            <p className="text-gray-600 leading-relaxed">
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será 
              submetida ao foro da comarca de São Paulo/SP.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">12. Contato</h2>
            <p className="text-gray-600 leading-relaxed">
              Dúvidas sobre estes Termos podem ser enviadas para:
            </p>
            <p className="text-gray-600 mt-2">
              <strong>E-mail:</strong> contato@guiadasbancas.com.br
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
