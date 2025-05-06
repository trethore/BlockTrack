import { DataPoint } from '@generated/prisma';

export interface CreateDataPointInput {
    tokenId: string;
    date: Date;
    priceUSD: number;
}

export interface IDataPointRepository {
    deleteAllDataPointsByTokenId(tokenId: string): Promise<number>;
    bulkCreate(dataPoints: CreateDataPointInput[]): Promise<number>;
}

export const IDataPointRepository = Symbol('IDataPointRepository');
