import { Router } from "express";

const loggerTestRouter = Router();

loggerTestRouter.get('/', (req, res) => {
    req.logger.debug('Debug message');
    req.logger.http('Http message');
    req.logger.info('Info message');
    req.logger.warning('Warning message');
    req.logger.error('Error message');
    req.logger.fatal('Fatal message');
})

export default loggerTestRouter;