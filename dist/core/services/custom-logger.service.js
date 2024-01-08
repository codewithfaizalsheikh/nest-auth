"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLoggerService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
let CustomLoggerService = class CustomLoggerService {
    constructor() {
        this.logFilePath = 'logs.json';
    }
    log(message, level = 'info') {
        const logData = {
            timestamp: new Date().toISOString(),
            level,
            message,
        };
        const logs = this.getLogsFromFile();
        logs.push(logData);
        this.saveLogsToFile(logs);
        this.logToConsole(logData);
    }
    error(message, stack) {
        let status = 500;
        if (message.toLowerCase().includes('unauthorized')) {
            status = 401;
        }
        if (message.includes('BadRequestException')) {
            status = 400;
        }
        if (message.includes('NotFoundException')) {
            status = 404;
        }
        const errorMessage = stack ? `${message}\n${stack}` : message;
        const errorLog = {
            timestamp: new Date().toISOString(),
            level: 'error',
            message: errorMessage,
            status,
        };
        this.log(errorMessage, 'error');
        return errorLog;
    }
    debug(message) {
        this.log(message, 'debug');
    }
    logToConsole(logData) {
        console[logData.level](logData.message);
    }
    getLogsFromFile() {
        try {
            const fileContent = fs.readFileSync(this.logFilePath, 'utf-8');
            return JSON.parse(fileContent);
        }
        catch (error) {
            return [];
        }
    }
    saveLogsToFile(logs) {
        fs.writeFileSync(this.logFilePath, JSON.stringify(logs, null, 2));
    }
};
exports.CustomLoggerService = CustomLoggerService;
exports.CustomLoggerService = CustomLoggerService = __decorate([
    (0, common_1.Injectable)()
], CustomLoggerService);
//# sourceMappingURL=custom-logger.service.js.map