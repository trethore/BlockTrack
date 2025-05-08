import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TOKEN_DETAILS, GET_ME, ADD_FAVORITE_TOKEN, REMOVE_FAVORITE_TOKEN } from '@lib/apollo/queries.ts';
import { TokenDetailsData, RawDataPoint, ChartDataPoint, ChartTimeframe, DEFAULT_CHART_TIMEFRAME, CHART_TIMEFRAMES } from '@/types/token.ts';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import TokenPriceChart from '@/components/token-details/TokenPriceChart.tsx';
import TokenStats from '@/components/token-details/TokenStats.tsx';
import FavoriteButton from '@/components/leaderboard/FavoriteButton.tsx';
import { toast } from 'sonner';

const ACCESS_TOKEN_KEY = 'AccessToken';

const TokenDetailsPage: React.FC = () => {
    const { tokenId } = useParams<{ tokenId: string }>();
    const [selectedTimeframe, setSelectedTimeframe] = useState<ChartTimeframe>(DEFAULT_CHART_TIMEFRAME);

    const { loading: tokenLoading, error: tokenError, data: tokenData } = useQuery<{ token: TokenDetailsData }>(GET_TOKEN_DETAILS, {
        variables: { id: tokenId },
        skip: !tokenId,
        fetchPolicy: 'cache-and-network',
    });

    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteMutationLoading, setFavoriteMutationLoading] = useState(false);
    const { loading: userLoading, error: userError, data: userData, refetch: refetchUser } = useQuery(GET_ME, {
        skip: !localStorage.getItem(ACCESS_TOKEN_KEY),
        fetchPolicy: 'network-only',
    });
    const [addFavoriteTokenMutation] = useMutation(ADD_FAVORITE_TOKEN);
    const [removeFavoriteTokenMutation] = useMutation(REMOVE_FAVORITE_TOKEN);

    const isAuthenticated = !!userData?.me && !!localStorage.getItem(ACCESS_TOKEN_KEY);
    const isAuthLoading = userLoading && !!localStorage.getItem(ACCESS_TOKEN_KEY);

    const token = tokenData?.token;

    useEffect(() => {
        if (userData?.me?.favorites && tokenId) {
            setIsFavorite(userData.me.favorites.some((fav: { id: string }) => fav.id === tokenId));
        } else if (!userLoading && !userData?.me) {
            setIsFavorite(false);
        }
    }, [userData, userLoading, tokenId]);

    const handleFavoriteToggle = async () => {
        if (!isAuthenticated || isAuthLoading || !tokenId) {
            toast.error("Please log in to manage favorites.");
            return;
        }
        if (favoriteMutationLoading) return;

        setFavoriteMutationLoading(true);
        const currentlyFavorite = isFavorite;
        const mutation = currentlyFavorite ? removeFavoriteTokenMutation : addFavoriteTokenMutation;
        setIsFavorite(!currentlyFavorite);

        try {
            await mutation({ variables: { tokenId } });
            toast.success(`Token ${currentlyFavorite ? 'removed from' : 'added to'} favorites!`);
            await refetchUser();
        } catch (error: any) {
            setIsFavorite(currentlyFavorite);
            toast.error(`Failed to ${currentlyFavorite ? 'remove from' : 'add to'} favorites: ${error.message}`);
            console.error("Favorite toggle error:", error);
        } finally {
            setFavoriteMutationLoading(false);
        }
    };

    const filteredDataPoints: ChartDataPoint[] = useMemo(() => {
        if (!token?.dataPoints) return [];

        const allPoints = token.dataPoints.map(dp => ({ ...dp, date: new Date(dp.date) }));
        if (allPoints.length === 0) return [];

        const now = new Date();
        let startDate = new Date(0);

        switch (selectedTimeframe) {
            case '1h':
                startDate = new Date(now.getTime() - 1 * 60 * 60 * 1000);
                break;
            case '1d':
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '1y':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
        }

        return allPoints
            .filter((dp: { date: Date, priceUSD: number }) => dp.date >= startDate)
            .map(dp => ({ date: dp.date.getTime(), price: dp.priceUSD }));

    }, [token?.dataPoints, selectedTimeframe]);

    const isLoading = (tokenLoading && !token) || (isAuthLoading && !!localStorage.getItem(ACCESS_TOKEN_KEY));

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Loading token details...</p>
            </div>
        );
    }

    if (tokenError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Error Loading Token</AlertTitle>
                    <AlertDescription>{tokenError.message}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Token Not Found</AlertTitle>
                    <AlertDescription>Could not find details for token ID: {tokenId}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (userError && isAuthenticated) {
        toast.error(`Error loading user favorites: ${userError.message}`);
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-y-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold">{token.name}</h1>
                    <span className="text-xl font-semibold text-muted-foreground">({token.symbol.toUpperCase()})</span>
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-muted text-muted-foreground rounded">
                        Rank #{token.rank ?? '?'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <FavoriteButton
                        tokenId={token.id}
                        isFavorite={isFavorite}
                        onToggle={handleFavoriteToggle}
                        isLoading={favoriteMutationLoading}
                        isAuthLoading={isAuthLoading}
                        isAuthenticated={isAuthenticated}
                    />
                    <ToggleGroup
                        type="single"
                        value={selectedTimeframe}
                        onValueChange={(value: ChartTimeframe) => {
                            if (value) setSelectedTimeframe(value);
                        }}
                        size="sm"
                    >
                        {CHART_TIMEFRAMES.map((period: ChartTimeframe) => (
                            <ToggleGroupItem key={period} value={period} aria-label={`Select ${period} period`}>
                                {period}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>
            </div>

            <div className='space-y-3'>
                <TokenPriceChart data={filteredDataPoints} isLoading={tokenLoading} />
            </div>

            <TokenStats token={token} />
        </div>
    );
};

export default TokenDetailsPage;