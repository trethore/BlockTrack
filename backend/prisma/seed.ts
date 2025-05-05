import 'reflect-metadata';
import { PrismaClient } from '@generated/prisma';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');
    // --- Suppression des données existantes ---
    await prisma.favorite.deleteMany();
    console.log('Deleted records in favorite table');
    await prisma.token.deleteMany();
    console.log('Deleted records in token table');
    await prisma.user.deleteMany();
    console.log('Deleted records in user table');
    await prisma.tokenUpdateLog.deleteMany();
    console.log('Deleted records in tokenUpdateLog table');


    // --- Création User ---
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const user1 = await prisma.user.create({
        data: {
            email: 'test@example.com',
            username: 'testuser',
            passwordHash: hashedPassword,
        },
    });
    console.log(`Created user with id: ${user1.id}`);

    // --- Création Tokens ---
    const createdTokens = await prisma.token.createMany({
        data: [
            {
                symbol: 'BTC',
                name: 'Bitcoin',
                rank: 1,
                priceUSD: 60000.50,
                marketCapUsd: 1200000000000.0,
                circulatingSupply: 19700000n,
                totalSupply: 19700000n,
                maxSupply: 21000000n,
                percentChange24h: 1.5,
                lastUpdated: new Date(),
            },
            {
                symbol: 'ETH',
                name: 'Ethereum',
                rank: 2,
                priceUSD: 3000.75,
                marketCapUsd: 360000000000.0,
                circulatingSupply: 120000000n,
                totalSupply: 120000000n,
                maxSupply: null,
                percentChange24h: 2.1,
                lastUpdated: new Date(),
            },
            {
                symbol: 'SOL',
                name: 'Solana',
                rank: 5,
                priceUSD: 150.20,
                marketCapUsd: 70000000000.0,
                circulatingSupply: 460000000n,
                totalSupply: 570000000n,
                maxSupply: null,
                percentChange24h: -0.5,
                lastUpdated: new Date(),
            },
            {
                symbol: 'ADA',
                name: 'Cardano',
                rank: 10,
                priceUSD: 0.45,
                marketCapUsd: 16000000000.0,
                circulatingSupply: 35000000000n,
                totalSupply: 36000000000n,
                maxSupply: 45000000000n,
                percentChange24h: 0.8,
                lastUpdated: new Date(),
            },
        ],
    });
    console.log(`Created ${createdTokens.count} tokens.`);

    const btc = await prisma.token.findUnique({ where: { symbol: 'BTC' } });
    const eth = await prisma.token.findUnique({ where: { symbol: 'ETH' } });
    if (!btc || !eth) {
        throw new Error("Could not find created tokens BTC or ETH to create favorites.");
    }

    // --- Création Favoris ---
    await prisma.favorite.createMany({
        data: [
            { userId: user1.id, tokenId: btc.id },
            { userId: user1.id, tokenId: eth.id },
        ],
    });
    console.log('Created favorite records.');

    await prisma.tokenUpdateLog.upsert({
        where: { id: 'SINGLETON' },
        update: { lastRefreshedAt: new Date() },
        create: { id: 'SINGLETON', lastRefreshedAt: new Date() },
    });
    console.log('Upserted token update log.');

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });