import { Injectable, Scope, Inject } from '@nestjs/common';
import DataLoader from 'dataloader';
import { DataPoint } from '@generated/prisma';
import { IDataPointRepository } from '@/src/token/domain/ports/datapoint.repository.interface';

@Injectable({ scope: Scope.REQUEST })
export class DataPointLoader extends DataLoader<string, DataPoint[]> {
    constructor(
        @Inject(IDataPointRepository)
        private readonly dataPointRepository: IDataPointRepository,
    ) {
        super(async (tokenIds: readonly string[]) => {
            const dataPoints = await this.dataPointRepository.findByTokenIds([...tokenIds]);

            const dataPointsMap = new Map<string, DataPoint[]>();
            dataPoints.forEach(dp => {
                const list = dataPointsMap.get(dp.tokenId) || [];
                list.push(dp);
                dataPointsMap.set(dp.tokenId, list);
            });

            return tokenIds.map(id => dataPointsMap.get(id) || []);
        });
    }
}