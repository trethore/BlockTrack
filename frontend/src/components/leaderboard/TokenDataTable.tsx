import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { TokenLeaderboardData, ChartTimeframe } from '@/types/token.ts';
import { formatPrice, formatMarketCap, formatPercentage } from '@lib/utils.ts';
import SupplyProgressBar from '@/components/leaderboard/SupplyProgressBar.tsx';
import FavoriteButton from '@/components/leaderboard/FavoriteButton.tsx';

interface TokenDataTableProps {
    tokens: TokenLeaderboardData[];
    isLoading: boolean;
    selectedTimePeriod: ChartTimeframe;
    userFavorites: Set<string>;
    optimisticFavorites?: Set<string>;
    onFavoriteToggle: (tokenId: string) => void;
    favoriteMutationLoading: Record<string, boolean>;
    isAuthLoading: boolean;
    isAuthenticated: boolean;
    showRank?: boolean;
}

const TokenDataTable: React.FC<TokenDataTableProps> = ({
    tokens,
    isLoading,
    selectedTimePeriod,
    userFavorites,
    optimisticFavorites,
    onFavoriteToggle,
    favoriteMutationLoading,
    isAuthLoading,
    isAuthenticated,
    showRank = true,
}) => {
    const navigate = useNavigate();

    const handleRowClick = (tokenId: string) => {
        navigate(`/token/${tokenId}`);
    };

    const getPercentChangeValue = (token: TokenLeaderboardData, period: ChartTimeframe): number | null => {
        switch (period) {
            case '1h':
                return token.percentChange1h;
            case '1d':
                return token.percentChange24h;
            case '7d':
                return token.percentChange7d;
            case '30d':
                return token.percentChange30d;
            case '1y':
                return token.percentChange1y;
            default:
                return null;
        }
    };

    const columnCount = showRank ? 7 : 6;

    const renderSkeletons = (count: number) =>
        Array(count)
            .fill(0)
            .map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                    {showRank && (
                        <TableCell className="text-center">
                            <Skeleton className="h-5 w-8 mx-auto" />
                        </TableCell>
                    )}
                    <TableCell>
                        <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell className="w-32 text-right">
                        <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell className="w-24 text-right">
                        <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell className="w-36 text-right">
                        <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell className="w-40 text-center">
                        <Skeleton className="h-8 w-full" />
                    </TableCell>
                    <TableCell className="w-16 text-center">
                        <Skeleton className="h-8 w-full" />
                    </TableCell>
                </TableRow>
            ));

    return (
        <div className="rounded-md border">
            <Table className="w-full table-fixed">
                <colgroup>
                    {showRank && <col className="w-14" />}
                    <col />
                    <col className="w-32" />
                    <col className="w-24" />
                    <col className="w-36" />
                    <col className="w-40" />
                    <col className="w-16" />
                </colgroup>

                <TableHeader>
                    <TableRow>
                        {showRank && <TableHead className="w-14 text-center">#</TableHead>}
                        <TableHead>Name</TableHead>
                        <TableHead className="w-32 text-right">Price</TableHead>
                        <TableHead className="w-24 text-right">% ({selectedTimePeriod.toUpperCase()})</TableHead>
                        <TableHead className="w-36 text-right">Market Cap</TableHead>
                        <TableHead className="w-40 text-center">Circulating Supply</TableHead>
                        <TableHead className="w-16 text-center">Favorite</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        renderSkeletons(10)
                    ) : tokens.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columnCount} className="h-24 text-center">
                                {userFavorites.size > 0
                                    ? 'No favorite tokens match the current filter.'
                                    : 'No tokens found.'}
                            </TableCell>
                        </TableRow>
                    ) : (
                        tokens.map((token) => {
                            const percentChange = getPercentChangeValue(token, selectedTimePeriod);

                            const favSetForButton = optimisticFavorites ?? userFavorites;
                            const isButtonFavorite = favSetForButton.has(token.id);
                            const isRowSelected = userFavorites.has(token.id);

                            return (
                                <TableRow
                                    key={token.id}
                                    data-state={isRowSelected ? 'selected' : ''}
                                    onClick={() => handleRowClick(token.id)}
                                    className="cursor-pointer"
                                >
                                    {showRank && (
                                        <TableCell className="w-14 font-medium text-center">
                                            {token.rank ?? 'N/A'}
                                        </TableCell>
                                    )}

                                    <TableCell>
                                        <div className="font-medium">{token.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {token.symbol.toUpperCase()}
                                        </div>
                                    </TableCell>

                                    <TableCell className="w-32 text-right">
                                        {formatPrice(token.priceUSD)}
                                    </TableCell>

                                    <TableCell
                                        className={`w-24 text-right ${percentChange === null
                                            ? ''
                                            : percentChange >= 0
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                            }`}
                                    >
                                        {formatPercentage(percentChange)}
                                    </TableCell>

                                    <TableCell className="w-36 text-right">
                                        <div>{formatMarketCap(token.marketCapUsd)}</div>
                                        {token.marketCapChange24h !== null &&
                                            token.marketCapUsd !== null &&
                                            token.marketCapUsd - (token.marketCapChange24h ?? 0) !== 0 && (
                                                <div
                                                    className={`text-xs ${token.marketCapChange24h >= 0
                                                        ? 'text-green-500'
                                                        : 'text-red-500'
                                                        }`}
                                                >
                                                    {formatPercentage(
                                                        ((token.marketCapChange24h ?? 0) /
                                                            (token.marketCapUsd - (token.marketCapChange24h ?? 0))) *
                                                        100,
                                                        false
                                                    )}{' '}
                                                    24h
                                                </div>
                                            )}
                                    </TableCell>

                                    <TableCell className="w-40 text-center">
                                        <SupplyProgressBar
                                            circulatingSupplyStr={token.circulatingSupply?.toString()}
                                            maxSupplyStr={token.maxSupply?.toString()}
                                            totalSupplyStr={token.totalSupply?.toString()}
                                            symbol={token.symbol.toUpperCase()}
                                        />
                                    </TableCell>

                                    <TableCell
                                        className="w-16 text-center"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <FavoriteButton
                                            tokenId={token.id}
                                            isFavorite={isButtonFavorite}
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
