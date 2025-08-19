// Centralized logging system with configurable levels
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: Date;
  source?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment) {
      // In production, only log warnings and errors
      return level === 'warn' || level === 'error';
    }
    return true;
  }

  private log(level: LogLevel, message: string, data?: any, source?: string) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date(),
      source
    };

    // Add to memory store
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output with formatting
    const prefix = `[${level.toUpperCase()}] ${source ? `[${source}] ` : ''}`;
    const timestamp = entry.timestamp.toISOString().substr(11, 12);
    
    switch (level) {
      case 'error':
        console.error(`${prefix}${timestamp}`, message, data || '');
        break;
      case 'warn':
        console.warn(`${prefix}${timestamp}`, message, data || '');
        break;
      case 'info':
        console.info(`${prefix}${timestamp}`, message, data || '');
        break;
      case 'debug':
        console.debug(`${prefix}${timestamp}`, message, data || '');
        break;
    }
  }

  debug(message: string, data?: any, source?: string) {
    this.log('debug', message, data, source);
  }

  info(message: string, data?: any, source?: string) {
    this.log('info', message, data, source);
  }

  warn(message: string, data?: any, source?: string) {
    this.log('warn', message, data, source);
  }

  error(message: string, data?: any, source?: string) {
    this.log('error', message, data, source);
  }

  // Get recent logs for debugging
  getRecentLogs(level?: LogLevel, limit = 50): LogEntry[] {
    let filtered = this.logs;
    if (level) {
      filtered = this.logs.filter(log => log.level === level);
    }
    return filtered.slice(-limit);
  }

  // Clear logs
  clear() {
    this.logs = [];
  }
}

// Export singleton instance
export const logger = new Logger();