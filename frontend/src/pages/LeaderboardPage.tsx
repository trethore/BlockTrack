import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, ApolloError } from '@apollo/client';
import { GET_ME, ADD_FAVORITE_TOKEN, REMOVE_FAVORITE_TOKEN } from '@lib/apollo/queries.js';
import { useCachedLeaderboard } from '@/lib/hooks/useCachedLeaderboard.ts';
import { TokenLeaderboardData, SortConfig, SortableTokenKey, SortDirection, DEFAULT_CHART_TIMEFRAME, CHART_TIMEFRAMES, ChartTimeframe, DEFAULT_SORT_DIRECTION } from '@/types/token.ts';
import TokenDataTable from '@/components/leaderboard/TokenDataTable.js';
import LeaderboardControls from '@/components/leaderboard/LeaderboardControls.js';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.js';
import { parseBigInt } from '@/lib/utils.js';

const ACCESS_TOKEN_KEY = 'AccessToken';

const DEFAULT_SORT_KEY: SortableTokenKey = 'marketCapUsd';

const LeaderboardPage: React.FC = () => {
    const [allTokens, setAllTokens] = useState<TokenLeaderboardData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: DEFAULT_SORT_KEY, direction: DEFAULT_SORT_DIRECTION });
    const [selectedTimePeriod, setSelectedTimePeriod] = useState<ChartTimeframe>(DEFAULT_CHART_TIMEFRAME);
    const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set());
    const [favoriteMutationLoading, setFavoriteMutationLoading] = useState<Record<string, boolean>>({});

    const {
        tokens: leaderboardApiTokens, // Renommez pour éviter confusion avec `allTokens`
        loading: tokensLoading,
        error: tokensError,
        refetchLeaderboard // Vous pouvez l'utiliser pour un bouton de rafraîchissement manuel
    } = useCachedLeaderboard();
    const { loading: userLoading, error: userError, data: userData, refetch: refetchUser } = useQuery(GET_ME, {
        skip: !localStorage.getItem(ACCESS_TOKEN_KEY),
        fetchPolicy: 'network-only',
    });

    const [addFavoriteTokenMutation] = useMutation(ADD_FAVORITE_TOKEN);
    const [removeFavoriteTokenMutation] = useMutation(REMOVE_FAVORITE_TOKEN);

    const isAuthenticated = !!userData?.me && !!localStorage.getItem(ACCESS_TOKEN_KEY);
    const isAuthLoading = userLoading && !!localStorage.getItem(ACCESS_TOKEN_KEY);


    useEffect(() => {
        if (leaderboardApiTokens) {
            const processedTokens = leaderboardApiTokens.map((token: any) => ({
                // ... votre logique de processing existante ...
                ...token,
                circulatingSupply: token.circulatingSupply, // Assurez-vous que parseBigInt est bien géré si nécessaire
                totalSupply: token.totalSupply,
                maxSupply: token.maxSupply,
            })) as TokenLeaderboardData[];
            setAllTokens(processedTokens);
        }
    }, [leaderboardApiTokens]);

    useEffect(() => {
        if (userData?.me?.favorites) {
            setUserFavorites(new Set(userData.me.favorites.map((fav: { id: string }) => fav.id)));
        } else if (!userLoading && !userData?.me && localStorage.getItem(ACCESS_TOKEN_KEY)) {
            setUserFavorites(new Set());
        }
    }, [userData, userLoading]);


    const handleFavoriteToggle = async (tokenId: string) => {
        if (!isAuthenticated || isAuthLoading) {
            toast.error("Please log in to manage favorites.");
            return;
        }
        if (favoriteMutationLoading[tokenId]) return;

        setFavoriteMutationLoading(prev => ({ ...prev, [tokenId]: true }));
        const isCurrentlyFavorite = userFavorites.has(tokenId);
        const mutation = isCurrentlyFavorite ? removeFavoriteTokenMutation : addFavoriteTokenMutation;
        const optimisticFavorites = new Set(userFavorites);
        if (isCurrentlyFavorite) {
            optimisticFavorites.delete(tokenId);
        } else {
            optimisticFavorites.add(tokenId);
        }
        setUserFavorites(optimisticFavorites);

        try {
            await mutation({ variables: { tokenId } });
            toast.success(`Token ${isCurrentlyFavorite ? 'removed from' : 'added to'} favorites!`);
            await refetchUser();
        } catch (error: any) {
            setUserFavorites(userFavorites);
            toast.error(`Failed to ${isCurrentlyFavorite ? 'remove from' : 'add to'} favorites: ${error.message}`);
            console.error("Favorite toggle error:", error);
        } finally {
            setFavoriteMutationLoading(prev => ({ ...prev, [tokenId]: false }));
        }
    };

    const filteredAndSortedTokens = useMemo(() => {
        let processedTokens = [...allTokens];

        if (searchTerm) {
            processedTokens = processedTokens.filter(
                (token) =>
                    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        processedTokens.sort((a, b) => {
            let valA_raw = a[sortConfig.key as keyof TokenLeaderboardData];
            let valB_raw = b[sortConfig.key as keyof TokenLeaderboardData];

            const valA = typeof valA_raw === 'bigint' ? Number(valA_raw) : valA_raw;
            const valB = typeof valB_raw === 'bigint' ? Number(valB_raw) : valB_raw;

            const aIsNull = valA === null || valA === undefined;
            const bIsNull = valB === null || valB === undefined;

            if (aIsNull && bIsNull) return 0;
            if (aIsNull) return 1;
            if (bIsNull) return -1;

            let comparison = 0;
            if (typeof valA === 'number' && typeof valB === 'number') {
                comparison = valA - valB;
            } else if (typeof valA === 'string' && typeof valB === 'string') {
                comparison = valA.localeCompare(valB, undefined, { sensitivity: 'base' });
            }
            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });

        return processedTokens;
    }, [allTokens, searchTerm, sortConfig]);

    const handleSortKeyChange = (key: SortableTokenKey) => {
        setSortConfig(prev => ({ ...prev, key }));
    };

    const handleSortDirectionChange = (direction: SortDirection) => {
        setSortConfig(prev => ({ ...prev, direction }));
    };


    if (tokensError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Error loading tokens</AlertTitle>
                    <AlertDescription>{tokensError.message}</AlertDescription>
                </Alert>
            </div>
        );
    }
    if (userError && isAuthenticated) {
        toast.error(`Error loading user favorites: ${userError.message}`);
    }


    return (
        <div className="container mx-auto py-6">
            <LeaderboardControls
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortConfig={sortConfig}
                onSortKeyChange={handleSortKeyChange}
                onSortDirectionChange={handleSortDirectionChange}
                selectedTimePeriod={selectedTimePeriod}
                onTimePeriodChange={setSelectedTimePeriod}
            // Optionnel: ajouter un bouton refresh qui appelle refetchLeaderboard
            // onRefresh={refetchLeaderboard}
            // isRefreshing={tokensLoading} // tokensLoading sera true pendant le refetch
            />
            <TokenDataTable
                tokens={filteredAndSortedTokens}
                isLoading={tokensLoading && (!allTokens || allTokens.length === 0)}
                selectedTimePeriod={selectedTimePeriod}
                userFavorites={userFavorites}
                onFavoriteToggle={handleFavoriteToggle}
                favoriteMutationLoading={favoriteMutationLoading}
                isAuthLoading={isAuthLoading}
                isAuthenticated={isAuthenticated}
            />
        </div>
    );
};

export default LeaderboardPage;