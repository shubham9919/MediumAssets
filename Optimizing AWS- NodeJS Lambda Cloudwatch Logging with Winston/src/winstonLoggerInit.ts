import winston, { Logger } from 'winston'
import { ILogging } from './interface/i-logging'

//exporting logger to use logger directly without init in each file
export declare var logger: Logger;
const LOG_PREFIX_CLASS = "WinstonLogger| "

export class WinstonLogger {
    private customLevels: ILogging.LoggingInit

    constructor(event: any, context: any) {
        this.customLevels = {
            levels: {
                emergency: 0,
                alert: 1,
                critical: 2,
                error: 3,
                warn: 4,
                notice: 5,
                info: 6,
                debug: 7
            }
        };
        const logConfigs: ILogging.EventDetails = {
            lambda: context?.functionName,
            "x-amazon-request-id": event?.requestContext?.requestId,
            uniqueIdentifier: event.pathParameters?.uid || event.pathParameters?.assetid || "",
            logLevel: event?.stageVariables?.logLevel || "info"
        }

        logger = this.initialize(logConfigs);
    }

    public initialize(event_details: ILogging.EventDetails): Logger {
        const LOG_PREFIX_FN = LOG_PREFIX_CLASS + "initialize| "

        try {
            const startTimeFn = performance.now();
            console.log(`${LOG_PREFIX_FN} #START#`);
            const LOGGER = winston.createLogger({
                levels: this.customLevels.levels,
                level: event_details.logLevel,

                //the metadata params may change from app to app. (maybve if we are deploying in elastic beanstalk, 
                //the lambda and all props are irrelevent. so need to have some more general approach here in subsequent iterations) 
                defaultMeta: {
                    lambda: event_details.lambda,
                    "x-amazon-request-id": event_details['x-amazon-request-id'],
                    uniqueIdentifier: event_details.uniqueIdentifier
                },
                format: winston.format.json(),
                transports: [
                    new winston.transports.Console()
                ]
            })
            const endTimeFn = performance.now();
            LOGGER.info(`${LOG_PREFIX_FN} #END#`);
            LOGGER.info(`${LOG_PREFIX_FN} function execution time ${endTimeFn - startTimeFn}`);
            return LOGGER

        } catch (error) {
            throw error
        }
    }
}
