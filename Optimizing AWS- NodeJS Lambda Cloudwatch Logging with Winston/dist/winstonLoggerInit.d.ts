import { Logger } from 'winston';
import { ILogging } from './interface/i-logging';
export declare var logger: Logger;
export declare class WinstonLogger {
    private customLevels;
    constructor(event: any, context: any);
    initialize(event_details: ILogging.EventDetails): Logger;
}
