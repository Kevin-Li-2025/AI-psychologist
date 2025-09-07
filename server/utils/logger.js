const fs = require('fs-extra');
const path = require('path');

class Logger {
  constructor(logDir = 'logs') {
    this.logDir = path.join(process.cwd(), logDir);
    this.ensureLogDir();
  }

  async ensureLogDir() {
    try {
      await fs.ensureDir(this.logDir);
    } catch (error) {
      console.error('Failed to create log directory:', error);
    }
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(data && { data })
    };
    
    return JSON.stringify(logEntry) + '\n';
  }

  async writeLog(level, message, data = null) {
    try {
      const logFile = path.join(this.logDir, `${level}.log`);
      const formattedMessage = this.formatMessage(level, message, data);
      
      await fs.appendFile(logFile, formattedMessage);
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }

  info(message, data = null) {
    console.info(`[INFO] ${message}`, data || '');
    this.writeLog('info', message, data);
  }

  warn(message, data = null) {
    console.warn(`[WARN] ${message}`, data || '');
    this.writeLog('warn', message, data);
  }

  error(message, data = null) {
    console.error(`[ERROR] ${message}`, data || '');
    this.writeLog('error', message, data);
  }

  debug(message, data = null) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, data || '');
      this.writeLog('debug', message, data);
    }
  }

  async clearLogs() {
    try {
      const logFiles = await fs.readdir(this.logDir);
      const deletePromises = logFiles.map(file => 
        fs.remove(path.join(this.logDir, file))
      );
      await Promise.all(deletePromises);
      console.log('All log files cleared');
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }
}

// 导出单例
const logger = new Logger();
module.exports = logger;
