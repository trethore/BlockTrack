import React from 'react';
import { TokenDetailsData } from '@/types/token.ts';
import { formatPrice, formatMarketCap, formatPercentage, formatSupplyDetailed } from '@/lib/utils.ts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';

interface TokenStatsProps {
    token: TokenDetailsData;
}

const StatItem: React.FC<{ label: string; value: string | number | null | undefined, className?: string }> = ({ label, value, className = '' }) => (
    <div className={`flex justify-between items-center py-2 border-b border-border/50 last:border-b-0 ${className}`}>
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-right">{value ?? 'N/A'}</span>
    </div>
);

const PercentStatItem: React.FC<{ label: string; value: number | null | undefined, className?: string }> = ({ label, value, className = '' }) => (
    <div className={`flex justify-between items-center py-2 border-b border-border/50 last:border-b-0 ${className}`}>
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={`text-sm font-medium text-right ${value === null || value === undefined ? '' : (value >= 0 ? 'text-green-500' : 'text-red-500')}`}>
            {formatPercentage(value)}
        </span>
    </div>
);


const TokenStats: React.FC<TokenStatsProps> = ({ token }) => {
    const circulatingSupply = BigInt(token.circulatingSupply || 0);
    const totalSupply = BigInt(token.totalSupply || 0);
    const maxSupply = BigInt(token.maxSupply || 0);

    let supplyPercentage: number | null = null;
    if (circulatingSupply !== null && maxSupply !== null && maxSupply > 0n) {
        supplyPercentage = Number(circulatingSupply * 10000n / maxSupply) / 100;
    } else if (circulatingSupply !== null && totalSupply !== null && totalSupply > 0n) {
        supplyPercentage = Number(circulatingSupply * 10000n / totalSupply) / 100;
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Price Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <StatItem label="Price" value={formatPrice(token.priceUSD)} />
                    <PercentStatItem label="Change (1h)" value={token.percentChange1h} />
                    <PercentStatItem label="Change (24h)" value={token.percentChange24h} />
                    <PercentStatItem label="Change (7d)" value={token.percentChange7d} />
                    <PercentStatItem label="Change (30d)" value={token.percentChange30d} />
                    <PercentStatItem label="Change (1y)" value={token.percentChange1y} />
                    <StatItem label="Last Updated" value={token.lastUpdated ? new Date(token.lastUpdated).toLocaleString() : 'N/A'} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Market & Supply</CardTitle>
                </CardHeader>
                <CardContent>
                    <StatItem label="Market Cap" value={formatMarketCap(token.marketCapUsd)} />
                    {token.marketCapChange24h !== null && token.marketCapUsd !== null && (
                        <StatItem label="Market Cap Change (24h)" value={formatMarketCap(token.marketCapChange24h)} className={token.marketCapChange24h >= 0 ? 'text-green-500' : 'text-red-500'} />
                    )}
                    <StatItem label="Rank" value={token.rank ?? 'N/A'} />
                    <StatItem label="Circulating Supply" value={`${formatSupplyDetailed(circulatingSupply)} ${token.symbol.toUpperCase()}`} />
                    <StatItem label="Total Supply" value={`${formatSupplyDetailed(totalSupply)} ${token.symbol.toUpperCase()}`} />
                    <StatItem label="Max Supply" value={maxSupply !== null ? `${formatSupplyDetailed(maxSupply)} ${token.symbol.toUpperCase()}` : 'Infinite'} />
                    {supplyPercentage !== null && (
                        <StatItem label="Circulating %" value={`${supplyPercentage.toFixed(2)}%`} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TokenStats;