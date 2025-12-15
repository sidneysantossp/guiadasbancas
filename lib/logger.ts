/**
 * Logger condicional para desenvolvimento
 * Em produção, os logs são silenciados para melhor performance e segurança
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: any[]) => {
    // Erros sempre são logados, mesmo em produção
    console.error(...args);
  },
  info: (...args: any[]) => {
    if (isDev) console.info(...args);
  },
  debug: (...args: any[]) => {
    if (isDev) console.debug(...args);
  },
  // Para logs críticos que devem aparecer em produção
  critical: (...args: any[]) => {
    console.error('[CRITICAL]', ...args);
  },
};

export default logger;
