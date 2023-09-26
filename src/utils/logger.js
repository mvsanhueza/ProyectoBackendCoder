import winston from 'winston';
import program from './commander.js';
import { __dirname } from './utils.js';

const levelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white'
    }
}

console.log( __dirname);

const logger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: program.opts().mode === 'prod' ? 'info' : 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: levelOptions.colors, all: true }),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(info => `${info.timestamp}  ${info.level} : ${info.message}`)
            ),
        }),
        new winston.transports.File({
            filename:  __dirname + '/errors.log', level: 'error',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(info => `${info.timestamp}  ${info.level} : ${info.message}`)
            ),  
        })
    ] 

});

export default logger;