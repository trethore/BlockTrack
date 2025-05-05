import { TokenUpdateLog } from '@generated/prisma';

export interface ITokenUpdateLogRepository {
    getLog(): Promise<TokenUpdateLog | null>;
    updateLog(lastRefreshedAt: Date): Promise<TokenUpdateLog>;
}

export const ITokenUpdateLogRepository = Symbol('ITokenUpdateLogRepository');