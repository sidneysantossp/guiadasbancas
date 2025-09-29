// Configuração centralizada do WhatsApp (simulação de banco de dados)
// Em produção, isso seria substituído por um banco de dados real

export interface WhatsAppConfig {
  baseUrl: string;
  apiKey: string;
  instanceName: string;
  isActive: boolean;
}

// Configuração global (simulação de banco)
let GLOBAL_WHATSAPP_CONFIG: WhatsAppConfig = {
  baseUrl: 'https://api.auditseo.com.br',
  apiKey: '43F2839534E2-4231-9BA7-C8193BD064DF',
  instanceName: 'SDR_AUDITSEO',
  isActive: true
};

// Funções para gerenciar a configuração
export function getWhatsAppConfig(): WhatsAppConfig {
  return { ...GLOBAL_WHATSAPP_CONFIG };
}

export function setWhatsAppConfig(config: Partial<WhatsAppConfig>): WhatsAppConfig {
  GLOBAL_WHATSAPP_CONFIG = {
    ...GLOBAL_WHATSAPP_CONFIG,
    ...config
  };
  
  console.log('[CONFIG] WhatsApp configuração atualizada:', GLOBAL_WHATSAPP_CONFIG);
  return { ...GLOBAL_WHATSAPP_CONFIG };
}

export function updateWhatsAppConfig(updates: Partial<WhatsAppConfig>): WhatsAppConfig {
  return setWhatsAppConfig(updates);
}

// Validar configuração
export function validateWhatsAppConfig(config: Partial<WhatsAppConfig>): string[] {
  const errors: string[] = [];
  
  if (!config.baseUrl) {
    errors.push('URL da Evolution API é obrigatória');
  } else if (!config.baseUrl.startsWith('http')) {
    errors.push('URL deve começar com http:// ou https://');
  }
  
  if (!config.apiKey) {
    errors.push('API Key é obrigatória');
  } else if (config.apiKey.length < 10) {
    errors.push('API Key deve ter pelo menos 10 caracteres');
  }
  
  if (!config.instanceName) {
    errors.push('Nome da instância é obrigatório');
  }
  
  return errors;
}

// Verificar se a configuração está completa
export function isWhatsAppConfigured(): boolean {
  const config = getWhatsAppConfig();
  return !!(config.baseUrl && config.apiKey && config.instanceName);
}
