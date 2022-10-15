import { LogLevel } from '@nestjs/common';

function getLogLevels(isProduction: boolean): LogLevel[] {
    return isProduction
        ? ['log', 'warn', 'error']
        : ['error', 'warn', 'log', 'verbose', 'debug'];
}

export default getLogLevels;
