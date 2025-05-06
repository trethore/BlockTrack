import { registerAs } from '@nestjs/config';

const appConfigObject = {
    port: parseInt(process.env.PORT ?? '3000', 10),
    jwt: {
        secret: process.env.JWT_SECRET || 'IM_ILLEGAL_PLS_CHANGE_ME',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
    refreshIntervals: {
        allTokens: parseInt(process.env.ALL_TOKENS_REFRESH_INTERVAL_MS ?? '3600000', 10),
        dataPoints: parseInt(process.env.DATA_POINTS_REFRESH_INTERVAL_MS ?? '3600000', 10),
    },
};

export type AppConfig = typeof appConfigObject;
export const appConfiguration = registerAs('app', (): AppConfig => appConfigObject);
