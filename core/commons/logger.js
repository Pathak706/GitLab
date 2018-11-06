const levels = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
};
var winston = require('winston');
const {
    createLogger,
    format,
    transports
} = require('winston');
const {
    combine,
    timestamp,
    label,
    prettyPrint,
    printf
} = format;

const myFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.File({
            filename: process.cwd() + '/logs/info.log',
            level: 'info'
        }),
        new transports.Console({
            level: 'info',
            handleExceptions: true,
            json: false,
            colorize: true,
        })
    ]
});

module.exports = logger;
