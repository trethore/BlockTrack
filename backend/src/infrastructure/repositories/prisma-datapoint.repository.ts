import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DataPoint, Prisma } from '@generated/prisma';
import { IDataPointRepository, CreateDataPointInput } from '../../token/domain/ports/datapoint.repository.interface';

@Injectable()
export class PrismaDataPointRepository implements IDataPointRepository {
    private readonly logger = new Logger(PrismaDataPointRepository.name);

    constructor(private readonly prisma: PrismaService) { }

    async deleteAllDataPointsByTokenId(tokenId: string): Promise<number> {
        try {
            const { count } = await this.prisma.dataPoint.deleteMany({
                where: {
                    tokenId: tokenId,
                },
            });
            this.logger.log(`Deleted ${count} data points for token ${tokenId}.`);
            return count;
        } catch (error) {
            this.logger.error(`Error deleting data points for token ${tokenId}:`, error);
            throw new Error(`Could not delete old data points for token ${tokenId}`);
        }
    }

    async bulkCreate(dataPoints: CreateDataPointInput[]): Promise<number> {
        if (dataPoints.length === 0) {
            this.logger.log('Bulk create skipped: No data points provided.');
            return 0;
        }

        try {
            const createManyInput: Prisma.DataPointCreateManyInput[] = dataPoints.map(dp => ({
                tokenId: dp.tokenId,
                date: dp.date,
                priceUSD: dp.priceUSD,
            }));


            const result = await this.prisma.dataPoint.createMany({
                data: createManyInput,
            });
            this.logger.log(`Bulk created ${result.count} data points.`);
            return result.count;
        } catch (error) {
            this.logger.error(`Error bulk creating data points:`, error);
            throw new Error('Could not save new data points');
        }
    }

    async findByTokenId(tokenId: string): Promise<DataPoint[]> {
        this.logger.log(`Finding data points for token ID: ${tokenId}`);
        try {
            return await this.prisma.dataPoint.findMany({
                where: { tokenId: tokenId },
                orderBy: {
                    date: 'asc',
                },
            });
        } catch (error) {
            this.logger.error(`Error finding data points for token ${tokenId}:`, error);
            return [];
        }
    }
}
