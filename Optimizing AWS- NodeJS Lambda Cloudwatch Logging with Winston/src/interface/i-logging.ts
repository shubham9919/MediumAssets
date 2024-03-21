import { AbstractConfigSetLevels } from "winston/lib/winston/config";

export namespace ILogging {
    export interface LoggingInit {
        levels: AbstractConfigSetLevels;
        colors?: Object;
    }

    export interface EventDetails {
        lambda?: string
        "x-amazon-request-id"?: string
        uniqueIdentifier?: string | number
        logLevel: string
    }
}