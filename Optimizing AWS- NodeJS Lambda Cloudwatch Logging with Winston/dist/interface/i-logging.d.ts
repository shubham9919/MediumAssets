import { AbstractConfigSetLevels } from "winston/lib/winston/config";
export declare namespace ILogging {
    interface LoggingInit {
        levels: AbstractConfigSetLevels;
        colors?: Object;
    }
    interface EventDetails {
        lambda?: string;
        "x-amazon-request-id"?: string;
        uniqueIdentifier?: string | number;
        logLevel: string;
    }
}
