const winston = require("winston");
const config = require('../config/config');
const fs = require('fs');
const logPath = config.logs.logFilePath + '/log.log';
const errorPath = config.logs.logFilePath + '/error.log';

const infologger = winston.createLogger({
    level: 'info',
    transports: [
        new (winston.transports.Console)({ timestamp: true }),
        new (winston.transports.File)({ filename: logPath })
    ]
});
const errorlogger = winston.createLogger({
    level: 'error',
    transports: [
        new (winston.transports.Console)({ timestamp: true }),
        new (winston.transports.File)({ filename: errorPath })
    ]
});

//Initiate Logger
const init = () => {
    try {
        fs.mkdirSync(config.logs.logFilePath);
    } catch (e) {
        if (e.code != 'EEXIST') {
            console.error("Could not set up log directory, error was: ", e);
            process.exit(1);
        }
    }
}

//Info Logger
const infoLog = (message) => {
    try {
        infologger.log('info', new Date() + " " + message);
    } catch (e) {
        console.error(message);
    }
}

//Error Logger
const errorLog = (err) => {
    try {
        errorlogger.log('error', new Date() + " " + err);
    } catch (e) {
        console.error(err);
    }
}

//UncaughtException Error Logger
process.setMaxListeners(0);

process
    .on('uncaughtException', (err) => {
        let errMessage = "['uncaughtException' event] " + err.stack || err.message;
        errorLog(errMessage);
    })
    .on('unhandledRejection', (reason, p) => {
        let errMessage = reason + 'Unhandled Rejection at Promise' + p;
        errorLog(errMessage);
    });

//Initiate the call
init();

module.exports = {
    info: infoLog,
    error: errorLog
};
