import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/src/prisma/prisma.service';
import { TokenUpdateLog } from '@generated/prisma';
import { ITokenUpdateLogRepository } from '@/src/token/domain/ports/token-update-log.repository.interface';

@Injectable()
export class PrismaTokenUpdateLogRepository implements ITokenUpdateLogRepository {
    private readonly SINGLETON_ID = 'SINGLETON';

    constructor(private readonly prisma: PrismaService) { }

    async getLog(): Promise<TokenUpdateLog | null> {
        return this.prisma.tokenUpdateLog.findUnique({
            where: { id: this.SINGLETON_ID },
        });
    }

    async updateLog(lastRefreshedAt: Date): Promise<TokenUpdateLog> {
        return this.prisma.tokenUpdateLog.upsert({
            where: { id: this.SINGLETON_ID },
            update: { lastRefreshedAt },
            create: { id: this.SINGLETON_ID, lastRefreshedAt },
        });
    }
}