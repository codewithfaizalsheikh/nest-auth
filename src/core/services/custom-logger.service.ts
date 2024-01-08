import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

type LogLevel = 'error' | 'debug' | 'info';

interface LogData {
  timestamp: string;
  level: LogLevel;
  message: string;
  status?: number; // Status code
}

@Injectable()
export class CustomLoggerService {
  private logFilePath = 'logs.json';

  log(message: string, level: LogLevel = 'info'): void {
    const logData: LogData = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };
    const logs = this.getLogsFromFile();
    logs.push(logData);

    this.saveLogsToFile(logs);
    this.logToConsole(logData); // Log to console
  }

  error(message: string, stack?: string): LogData & { status: number } {
    let status = 500; // Default status code

    if (message.toLowerCase().includes('unauthorized')) {
      status = 401; // Unauthorized status code
    }

    if (message.includes('BadRequestException')) {
      status = 400; // Unauthorized status code
    }

    if (message.includes('NotFoundException')) {
      status = 404; // Unauthorized status code
    }

    const errorMessage = stack ? `${message}\n${stack}` : message;
    const errorLog: LogData & { status: number } = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: errorMessage,
      status,
    };
    this.log(errorMessage, 'error');
    return errorLog;
  }

  debug(message: string): void {
    this.log(message, 'debug');
  }

  private logToConsole(logData: LogData): void {
    console[logData.level](logData.message); // Log to console based on the log level
  }

  private getLogsFromFile(): LogData[] {
    try {
      const fileContent = fs.readFileSync(this.logFilePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      // If the file doesn't exist or is empty, return an empty array
      return [];
    }
  }

  private saveLogsToFile(logs: LogData[]): void {
    fs.writeFileSync(this.logFilePath, JSON.stringify(logs, null, 2));
  }
}
