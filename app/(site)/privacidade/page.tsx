import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | Guia das Bancas",
  description: "Política de Privacidade do Guia das Bancas - Saiba como tratamos seus dados pessoais.",
};

export default function PrivacidadePage() {
  return (
    <main className="container-max py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Privacidade</h1>
        <p className="text-sm text-gray-500 mb-8">Última atualização: Janeiro de 2026</p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introdução</h2>
            <p className="text-gray-600 leading-relaxed">
              O Guia das Bancas ("nós", "nosso" ou "Plataforma") está comprometido em proteger a privacidade dos usuários. 
              Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais 
              quando você utiliza nosso site e serviços.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Dados que Coletamos</h2>
            <p className="text-gray-600 leading-relaxed mb-3">Podemos coletar os seguintes tipos de informações:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Dados de cadastro:</strong> nome, e-mail, telefone, endereço</li>
              <li><strong>Dados de navegação:</strong> páginas visitadas, tempo de permanência, dispositivo utilizado</li>
              <li><strong>Dados de transação:</strong> histórico de pedidos, produtos visualizados</li>
              <li><strong>Dados de localização:</strong> para exibir bancas próximas a você</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Como Usamos seus Dados</h2>
            <p className="text-gray-600 leading-relaxed mb-3">Utilizamos suas informações para:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Processar pedidos e transações</li>
              <li>Personalizar sua experiência na plataforma</li>
              <li>Enviar comunicações relevantes (com seu consentimento)</li>
              <li>Garantir a segurança da plataforma</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do site e 
              personalizar conteúdo. Você pode gerenciar suas preferências de cookies a qualquer momento através 
              do banner de consentimento ou das configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Compartilhamento de Dados</h2>
            <p className="text-gray-600 leading-relaxed mb-3">Podemos compartilhar seus dados com:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Bancas parceiras:</strong> para processar seus pedidos</li>
              <li><strong>Prestadores de serviço:</strong> que nos auxiliam nas operações (pagamento, análise, etc.)</li>
              <li><strong>Autoridades:</strong> quando exigido por lei</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Não vendemos suas informações pessoais a terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Segurança</h2>
            <p className="text-gray-600 leading-relaxed">
              Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, 
              alteração, divulgação ou destruição. Isso inclui criptografia, controles de acesso e monitoramento contínuo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Seus Direitos</h2>
            <p className="text-gray-600 leading-relaxed mb-3">De acordo com a LGPD, você tem direito a:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar consentimento</li>
              <li>Portabilidade dos dados</li>
              <li>Informações sobre compartilhamento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Retenção de Dados</h2>
            <p className="text-gray-600 leading-relaxed">
              Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política, 
              a menos que um período de retenção maior seja exigido ou permitido por lei.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Contato</h2>
            <p className="text-gray-600 leading-relaxed">
              Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato conosco:
            </p>
            <p className="text-gray-600 mt-2">
              <strong>E-mail:</strong> privacidade@guiadasbancas.com.br
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Alterações</h2>
            <p className="text-gray-600 leading-relaxed">
              Esta política pode ser atualizada periodicamente. Notificaremos sobre alterações significativas 
              através do site ou por e-mail.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
