/**
 * Sistema de logs para sincronização Mercos
 * Facilita debugging e monitoramento
 */

export interface SyncLogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  distribuidor?: string;
  message: string;
  data?: any;
}

export class SyncLogger {
  private logs: SyncLogEntry[] = [];
  private maxLogs = 1000; // Manter apenas os últimos 1000 logs

  log(level: SyncLogEntry['level'], message: string, data?: any, distribuidor?: string) {
    const entry: SyncLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      distribuidor,
    };

    this.logs.unshift(entry);
    
    // Manter apenas os logs mais recentes
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Log no console também
    const prefix = `[SYNC${distribuidor ? ` - ${distribuidor}` : ''}]`;
    const emoji = this.getEmoji(level);
    
    console.log(`${prefix} ${emoji} ${message}`, data ? data : '');
  }

  info(message: string, data?: any, distribuidor?: string) {
    this.log('info', message, data, distribuidor);
  }

  success(message: string, data?: any, distribuidor?: string) {
    this.log('success', message, data, distribuidor);
  }

  warning(message: string, data?: any, distribuidor?: string) {
    this.log('warning', message, data, distribuidor);
  }

  error(message: string, data?: any, distribuidor?: string) {
    this.log('error', message, data, distribuidor);
  }

  private getEmoji(level: SyncLogEntry['level']): string {
    switch (level) {
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '📝';
    }
  }

  getLogs(limit?: number): SyncLogEntry[] {
    return limit ? this.logs.slice(0, limit) : this.logs;
  }

  getLogsByDistribuidor(distribuidor: string, limit?: number): SyncLogEntry[] {
    const filtered = this.logs.filter(log => log.distribuidor === distribuidor);
    return limit ? filtered.slice(0, limit) : filtered;
  }

  clearLogs() {
    this.logs = [];
  }

  // Estatísticas rápidas
  getStats() {
    const total = this.logs.length;
    const errors = this.logs.filter(log => log.level === 'error').length;
    const warnings = this.logs.filter(log => log.level === 'warning').length;
    const success = this.logs.filter(log => log.level === 'success').length;

    return {
      total,
      errors,
      warnings,
      success,
      errorRate: total > 0 ? (errors / total * 100).toFixed(1) : '0',
    };
  }
}

// Instância global do logger
export const syncLogger = new SyncLogger();
