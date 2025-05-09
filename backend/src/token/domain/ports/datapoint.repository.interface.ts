import { DataPoint } from '@generated/prisma';

export interface CreateDataPointInput {
    tokenId: string;
    date: Date;
    priceUSD: number;
}

export interface IDataPointRepository {
    deleteAllDataPointsByTokenId(tokenId: string): Promise<number>;
    bulkCreate(dataPoints: CreateDataPointInput[]): Promise<number>;
    findByTokenId(tokenId: string): Promise<DataPoint[]>;
    findByTokenIds(tokenIds: string[]): Promise<DataPoint[]>;
}

export const IDataPointRepository = Symbol('IDataPointRepository');
