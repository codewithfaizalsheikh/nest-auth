type LogLevel = 'error' | 'debug' | 'info';
interface LogData {
    timestamp: string;
    level: LogLevel;
    message: string;
    status?: number;
}
export declare class CustomLoggerService {
    private logFilePath;
    log(message: string, level?: LogLevel): void;
    error(message: string, stack?: string): LogData & {
        status: number;
    };
    debug(message: string): void;
    private logToConsole;
    private getLogsFromFile;
    private saveLogsToFile;
}
export {};
