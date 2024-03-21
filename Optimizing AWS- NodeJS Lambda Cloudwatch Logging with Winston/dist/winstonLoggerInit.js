"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinstonLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const LOG_PREFIX_CLASS = "WinstonLogger| ";
class WinstonLogger {
    constructor(event, context) {
        var _a, _b, _c, _d;
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
        const logConfigs = {
            lambda: context === null || context === void 0 ? void 0 : context.functionName,
            "x-amazon-request-id": (_a = event === null || event === void 0 ? void 0 : event.requestContext) === null || _a === void 0 ? void 0 : _a.requestId,
            uniqueIdentifier: ((_b = event.pathParameters) === null || _b === void 0 ? void 0 : _b.uid) || ((_c = event.pathParameters) === null || _c === void 0 ? void 0 : _c.assetid) || "",
            logLevel: ((_d = event === null || event === void 0 ? void 0 : event.stageVariables) === null || _d === void 0 ? void 0 : _d.logLevel) || "info"
        };
        exports.logger = this.initialize(logConfigs);
    }
    initialize(event_details) {
        const LOG_PREFIX_FN = LOG_PREFIX_CLASS + "initialize| ";
        try {
            const startTimeFn = performance.now();
            exports.logger.info(`${LOG_PREFIX_FN} #START#`);
            const LOGGER = winston_1.default.createLogger({
                levels: this.customLevels.levels,
                level: event_details.logLevel,
                //the metadata params may change from app to app. (maybve if we are deploying in elastic beanstalk, 
                //the lambda and all props are irrelevent. so need to have some more general approach here in subsequent iterations) 
                defaultMeta: {
                    lambda: event_details.lambda,
                    "x-amazon-request-id": event_details['x-amazon-request-id'],
                    uniqueIdentifier: event_details.uniqueIdentifier
                },
                format: winston_1.default.format.json(),
                transports: [
                    new winston_1.default.transports.Console()
                ]
            });
            const endTimeFn = performance.now();
            exports.logger.info(`${LOG_PREFIX_FN} #END#`);
            exports.logger.info(`${LOG_PREFIX_FN} function execution time ${endTimeFn - startTimeFn}`);
            return LOGGER;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.WinstonLogger = WinstonLogger;
