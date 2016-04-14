const fs = require('fs');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs'); // create new directory
}
winston.emitErrs = true;

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: false,
      colorize: true,
      prettyPrint: true,
    }),
    new DailyRotateFile({
      name: 'log.info',
      level: 'info',
      datePattern: 'yyyy-MM-dd',
      filename: './logs/info.log',
      handleExceptions: false,
      json: true,
      maxsize: 5242880,
      maxFiles: 10,
      colorize: true,
    }),
    new DailyRotateFile({
      name: 'log.warn',
      level: 'warn',
      filename: './logs/warn.log',
      handleExceptions: false,
      json: true,
      maxsize: 5242880,
      maxFiles: 10,
      colorize: true,
      datePattern: 'yyyy-MM-dd',
    }),
    new DailyRotateFile({
      name: 'log.error',
      level: 'error',
      filename: './logs/error.log',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: true,
      maxsize: 5242880,
      maxFiles: 10,
      colorize: true,
      datePattern: 'yyyy-MM-dd',
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
module.exports.stream = {
  write(message) {
    logger.info(message);
  },
};
