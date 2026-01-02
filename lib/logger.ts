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
    // Erros sempre são logados, mesmo em produção (mas sem dados sensíveis)
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
  debug: (...args: any[]) => {
    if (isDev) console.debug(...args);
  },
};

export default logger;
