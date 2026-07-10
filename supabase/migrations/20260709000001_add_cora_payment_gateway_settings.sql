-- Configuracoes para selecionar gateway e integrar a Cora como alternativa ao Asaas.

INSERT INTO system_settings (key, value, description, is_secret)
VALUES
  ('payment_gateway', 'asaas', 'Gateway usado para novas cobranças de assinatura: asaas ou cora', false),
  ('cora_environment', 'stage', 'Ambiente da Cora: stage ou production', false),
  ('cora_client_id', '', 'Client ID da integração direta Cora', true),
  ('cora_certificate', '', 'Certificado PEM da integração direta Cora', true),
  ('cora_private_key', '', 'Private key PEM da integração direta Cora', true),
  ('cora_webhook_token', '', 'Token compartilhado para validar webhooks da Cora', true)
ON CONFLICT (key) DO NOTHING;
