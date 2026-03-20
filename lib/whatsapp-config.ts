// Configuração centralizada do WhatsApp (simulação de banco de dados)
// Em produção, isso seria substituído por um banco de dados real

export interface WhatsAppConfig {
  baseUrl: string;
  apiKey: string;
  instanceName: string;
  isActive: boolean;
}

// Override em memória (aplicado via painel admin durante a sessão)
let MEMORY_OVERRIDE: Partial<WhatsAppConfig> | null = null;

// Lê sempre das variáveis de ambiente como base, com override em memória sobreposto
// Valores vazios no override NÃO sobrescrevem os valores do env
export function getWhatsAppConfig(): WhatsAppConfig {
  const envConfig: WhatsAppConfig = {
    baseUrl: (process.env.EVOLUTION_API_URL || 'https://api.guiadasbancas.com.br').replace(/\/$/, ''),
    apiKey: process.env.EVOLUTION_API_KEY || '',
    instanceName: process.env.EVOLUTION_INSTANCE_NAME || 'guiadasbancas',
    isActive: !!(process.env.EVOLUTION_API_KEY && process.env.EVOLUTION_INSTANCE_NAME),
  };

  if (MEMORY_OVERRIDE) {
    return {
      baseUrl: MEMORY_OVERRIDE.baseUrl || envConfig.baseUrl,
      apiKey: MEMORY_OVERRIDE.apiKey || envConfig.apiKey,
      instanceName: MEMORY_OVERRIDE.instanceName || envConfig.instanceName,
      isActive: MEMORY_OVERRIDE.isActive !== undefined ? MEMORY_OVERRIDE.isActive : envConfig.isActive,
    };
  }

  return envConfig;
}

export function setWhatsAppConfig(config: Partial<WhatsAppConfig>): WhatsAppConfig {
  const sanitized: Partial<WhatsAppConfig> = {
    ...config,
  };

  if (sanitized.baseUrl !== undefined) {
    sanitized.baseUrl = (sanitized.baseUrl || '').trim().replace(/\/$/, '');
  }
  if (sanitized.apiKey !== undefined) {
    sanitized.apiKey = (sanitized.apiKey || '').trim();
  }
  if (sanitized.instanceName !== undefined) {
    sanitized.instanceName = (sanitized.instanceName || '').trim();
  }

  MEMORY_OVERRIDE = {
    ...(MEMORY_OVERRIDE || {}),
    ...sanitized,
  };
  
  return getWhatsAppConfig();
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
