import logger from '../utils/logger.js';

export const addLogger = (req, res, next) => {
    req.logger = logger;
    //req.logger.debug(`${req.method} en ${req.url} - ${new Date().toLocaleString()}`);
    next();
}