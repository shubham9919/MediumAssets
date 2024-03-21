import { WinstonLogger, logger } from './winstonLoggerInit'

export let handler = async (event: any = null, context: any = null) => {
    try {
        const LOG_PREFIX_FN = "handler| "

        // just logging the event with console.log since the winston logger 
        // is not yet initialized and we dont wanna miss any event if logger init fails
        console.log("event", JSON.stringify(event))

        // fn start time
        const startTimeFn = performance.now();

        // logger initialize 
        new WinstonLogger(event, context)

        logger.info(`${LOG_PREFIX_FN} #LAMBDA_START#`);

        const response = {
            statusCode: 200,
            body: JSON.stringify('Hello from Lambda!'),
        }

        const endTimeFn = performance.now();

        logger.info(`${LOG_PREFIX_FN} #LAMBDA_END#`);
        logger.info(`${LOG_PREFIX_FN} function execution time ${endTimeFn - startTimeFn}`);
        return response

    } catch (error) {
        throw error
    }

}