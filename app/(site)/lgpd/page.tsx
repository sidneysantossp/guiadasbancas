import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LGPD - Lei Geral de Proteção de Dados | Guia das Bancas",
  description: "Saiba como o Guia das Bancas está em conformidade com a LGPD e seus direitos como titular de dados.",
};

export default function LGPDPage() {
  return (
    <main className="container-max py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">LGPD - Lei Geral de Proteção de Dados</h1>
        <p className="text-sm text-gray-500 mb-8">Última atualização: Janeiro de 2026</p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">O que é a LGPD?</h2>
            <p className="text-gray-600 leading-relaxed">
              A Lei Geral de Proteção de Dados (Lei nº 13.709/2018) é a legislação brasileira que regula o 
              tratamento de dados pessoais. O Guia das Bancas está comprometido em garantir a conformidade 
              com esta lei, protegendo seus dados e respeitando seus direitos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Seus Direitos como Titular</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              De acordo com a LGPD, você possui os seguintes direitos:
            </p>
            <div className="grid gap-4 mt-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">✓ Confirmação e Acesso</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Confirmar se tratamos seus dados e acessar as informações que temos sobre você.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">✓ Correção</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Solicitar a correção de dados incompletos, inexatos ou desatualizados.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">✓ Anonimização, Bloqueio ou Eliminação</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Solicitar o tratamento adequado de dados desnecessários ou excessivos.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">✓ Portabilidade</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Receber seus dados em formato estruturado para transferência a outro fornecedor.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">✓ Eliminação</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Solicitar a exclusão dos dados tratados com seu consentimento.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">✓ Informação sobre Compartilhamento</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Saber com quais entidades públicas e privadas seus dados são compartilhados.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">✓ Revogação do Consentimento</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Revogar o consentimento dado para o tratamento de seus dados a qualquer momento.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Bases Legais para Tratamento</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Tratamos seus dados pessoais com base nas seguintes hipóteses legais previstas na LGPD:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Consentimento:</strong> quando você autoriza expressamente o tratamento</li>
              <li><strong>Execução de contrato:</strong> para fornecer nossos serviços</li>
              <li><strong>Legítimo interesse:</strong> para melhorar a plataforma e sua experiência</li>
              <li><strong>Cumprimento de obrigação legal:</strong> quando exigido por lei</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Encarregado de Dados (DPO)</h2>
            <p className="text-gray-600 leading-relaxed">
              Nomeamos um Encarregado pelo Tratamento de Dados Pessoais (DPO - Data Protection Officer) 
              responsável por garantir a conformidade com a LGPD e atender suas solicitações.
            </p>
            <div className="bg-[#fff4ec] rounded-lg p-4 mt-4">
              <p className="text-gray-700">
                <strong>Contato do DPO:</strong><br />
                E-mail: dpo@guiadasbancas.com.br
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Como Exercer seus Direitos</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Para exercer qualquer um de seus direitos, você pode:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Enviar e-mail para <strong>dpo@guiadasbancas.com.br</strong></li>
              <li>Acessar as configurações da sua conta no site</li>
              <li>Entrar em contato pelo WhatsApp disponível no site</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Responderemos sua solicitação em até 15 dias úteis, conforme previsto na legislação.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Medidas de Segurança</h2>
            <p className="text-gray-600 leading-relaxed">
              Adotamos medidas técnicas e administrativas para proteger seus dados pessoais:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Controle de acesso restrito aos dados</li>
              <li>Monitoramento e logs de segurança</li>
              <li>Treinamento de colaboradores sobre proteção de dados</li>
              <li>Avaliações periódicas de segurança</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Documentos Relacionados</h2>
            <p className="text-gray-600 leading-relaxed">
              Para mais informações sobre como tratamos seus dados, consulte também:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
              <li>
                <Link href="/privacidade" className="text-[#ff5c00] underline">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-[#ff5c00] underline">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">ANPD</h2>
            <p className="text-gray-600 leading-relaxed">
              Se você acredita que seus direitos não foram atendidos, pode apresentar reclamação à 
              Autoridade Nacional de Proteção de Dados (ANPD) através do site{" "}
              <a 
                href="https://www.gov.br/anpd" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#ff5c00] underline"
              >
                www.gov.br/anpd
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
