const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

class Logger {
  constructor() {
    this.logger = createLogger({
      format: combine(
        timestamp(),
        printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })
      ]
    });
  }

  log(level, message) {
    this.logger.log({ level, message });
  }

  error(message) {
    this.logger.error(message);
  }
}

module.exports = Logger;

