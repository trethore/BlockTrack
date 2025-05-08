import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table.js';
import { Skeleton } from '../ui/skeleton.js';
import { TokenLeaderboardData, TimePeriod } from '../../types/token.js';
import { formatPrice, formatMarketCap, formatPercentage } from '../../lib/utils.js';
import SupplyProgressBar from './SupplyProgressBar.js';
import FavoriteButton from './FavoriteButton.js';

interface TokenDataTableProps {
    tokens: TokenLeaderboardData[];
    isLoading: boolean; // For initial data loading
    selectedTimePeriod: TimePeriod;
    userFavorites: Set<string>;
    onFavoriteToggle: (tokenId: string) => void;
    favoriteMutationLoading: Record<string, boolean>;
    isAuthLoading: boolean;
    isAuthenticated: boolean;
}

const TokenDataTable: React.FC<TokenDataTableProps> = ({
    tokens,
    isLoading,
    selectedTimePeriod,
    userFavorites,
    onFavoriteToggle,
    favoriteMutationLoading,
    isAuthLoading,
    isAuthenticated,
}) => {
    const getPercentChangeValue = (token: TokenLeaderboardData, period: TimePeriod): number | null => {
        switch (period) {
            case '1h': return token.percentChange1h;
            case '24h': return token.percentChange24h;
            case '7d': return token.percentChange7d;
            case '30d': return token.percentChange30d;
            case '1y': return token.percentChange1y;
            default: return null;
        }
    };

    const renderSkeletons = (count: number) =>
        Array(count)
            .fill(0)
            .map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="w-[150px]"><Skeleton className="h-8 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
            ));

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px] text-center">#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">% Change ({selectedTimePeriod.toUpperCase()})</TableHead>
                        <TableHead className="text-right">Market Cap</TableHead>
                        <TableHead className="w-[150px] text-center">Circulating Supply</TableHead>
                        <TableHead className="w-[80px] text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        renderSkeletons(10)
                    ) : tokens.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                No tokens found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        tokens.map((token) => {
                            const percentChange = getPercentChangeValue(token, selectedTimePeriod);
                            const isFavorite = userFavorites.has(token.id);
                            return (
                                <TableRow key={token.id} data-state={isFavorite ? "selected" : ""}>
                                    <TableCell className="font-medium text-center">{token.rank}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{token.name}</div>
                                        <div className="text-xs text-muted-foreground">{token.symbol.toUpperCase()}</div>
                                    </TableCell>
                                    <TableCell className="text-right">{formatPrice(token.priceUSD)}</TableCell>
                                    <TableCell className={`text-right ${percentChange === null ? '' : (percentChange >= 0 ? 'text-green-500' : 'text-red-500')}`}>
                                        {formatPercentage(percentChange)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div>{formatMarketCap(token.marketCapUsd)}</div>
                                        {token.marketCapChange24h !== null && (
                                            <div className={`text-xs ${token.marketCapChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {formatPercentage(token.marketCapChange24h / (token.marketCapUsd || 1) * 100, false)} 24h
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="w-[150px]">
                                        <SupplyProgressBar
                                            circulatingSupplyStr={token.circulatingSupply?.toString()}
                                            maxSupplyStr={token.maxSupply?.toString()}
                                            totalSupplyStr={token.totalSupply?.toString()}
                                            symbol={token.symbol.toUpperCase()}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <FavoriteButton
                                            tokenId={token.id}
                                            isFavorite={isFavorite}
                                            onToggle={onFavoriteToggle}
                                            isLoading={favoriteMutationLoading[token.id] || false}
                                            isAuthLoading={isAuthLoading}
                                            isAuthenticated={isAuthenticated}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default TokenDataTable;