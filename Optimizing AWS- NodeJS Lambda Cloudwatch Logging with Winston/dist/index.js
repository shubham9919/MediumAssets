"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const winstonLoggerInit_1 = require("./winstonLoggerInit");
let handler = async (event = null, context = null) => {
    try {
        const LOG_PREFIX_FN = "handler| ";
        // just logging the event with console.log since the winston logger 
        // is not yet initialized and we dont wanna miss any event if logger init fails
        console.log("event", JSON.stringify(event));
        // fn start time
        const startTimeFn = performance.now();
        // logger initialize 
        new winstonLoggerInit_1.WinstonLogger(event, context);
        winstonLoggerInit_1.logger.info(`${LOG_PREFIX_FN} #LAMBDA_START#`);
        const response = {
            statusCode: 200,
            body: JSON.stringify('Hello from Lambda!'),
        };
        const endTimeFn = performance.now();
        winstonLoggerInit_1.logger.info(`${LOG_PREFIX_FN} #LAMBDA_END#`);
        winstonLoggerInit_1.logger.info(`${LOG_PREFIX_FN} function execution time ${endTimeFn - startTimeFn}`);
        return response;
    }
    catch (error) {
        throw error;
    }
};
exports.handler = handler;
