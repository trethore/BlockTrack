import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, ApolloError } from '@apollo/client';
import { GET_TOKENS_FOR_LEADERBOARD, GET_ME, ADD_FAVORITE_TOKEN, REMOVE_FAVORITE_TOKEN } from '../lib/apollo/queries.js';
import { TokenLeaderboardData, TimePeriod, SortConfig, SortableTokenKey, SortDirection, DEFAULT_TIME_PERIOD, DEFAULT_SORT_KEY, DEFAULT_SORT_DIRECTION } from '../types/token.js';
import TokenDataTable from '../components/leaderboard/TokenDataTable.js';
import LeaderboardControls from '../components/leaderboard/LeaderboardControls.js';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert.js';
import { parseBigInt } from '../lib/utils.js'; // Import parseBigInt

const ACCESS_TOKEN_KEY = 'AccessToken'; // Assuming this is consistent with AccountPage

const LeaderboardPage: React.FC = () => {
    const [allTokens, setAllTokens] = useState<TokenLeaderboardData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: DEFAULT_SORT_KEY, direction: DEFAULT_SORT_DIRECTION });
    const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>(DEFAULT_TIME_PERIOD);
    const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set());
    const [favoriteMutationLoading, setFavoriteMutationLoading] = useState<Record<string, boolean>>({});

    const { loading: tokensLoading, error: tokensError, data: tokensData } = useQuery(GET_TOKENS_FOR_LEADERBOARD);
    const { loading: userLoading, error: userError, data: userData, refetch: refetchUser } = useQuery(GET_ME, {
        skip: !localStorage.getItem(ACCESS_TOKEN_KEY), // Skip if no token
        fetchPolicy: 'network-only',
    });

    const [addFavoriteTokenMutation] = useMutation(ADD_FAVORITE_TOKEN);
    const [removeFavoriteTokenMutation] = useMutation(REMOVE_FAVORITE_TOKEN);

    const isAuthenticated = !!userData?.me && !!localStorage.getItem(ACCESS_TOKEN_KEY);
    const isAuthLoading = userLoading && !!localStorage.getItem(ACCESS_TOKEN_KEY);


    useEffect(() => {
        if (tokensData?.tokens) {
            // Ensure BigInts are handled correctly if they come as strings or numbers from GQL
            const processedTokens = tokensData.tokens.map((token: any) => ({
                ...token,
                circulatingSupply: token.circulatingSupply, // keep as is, will be parsed in component
                totalSupply: token.totalSupply,
                maxSupply: token.maxSupply,
            })) as TokenLeaderboardData[];
            setAllTokens(processedTokens);
        }
    }, [tokensData]);

    useEffect(() => {
        if (userData?.me?.favorites) {
            setUserFavorites(new Set(userData.me.favorites.map((fav: { id: string }) => fav.id)));
        } else if (!userLoading && !userData?.me && localStorage.getItem(ACCESS_TOKEN_KEY)) {
            // If token exists but no user data (e.g., invalid token), clear local favorites
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
        setUserFavorites(optimisticFavorites); // Optimistic update

        try {
            await mutation({ variables: { tokenId } });
            toast.success(`Token ${isCurrentlyFavorite ? 'removed from' : 'added to'} favorites!`);
            await refetchUser(); // Refetch user data to get the latest favorites
        } catch (error: any) {
            setUserFavorites(userFavorites); // Revert optimistic update on error
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
            let valA = a[sortConfig.key as keyof TokenLeaderboardData];
            let valB = b[sortConfig.key as keyof TokenLeaderboardData];

            // Handle percent change sorting specifically if needed
            if (sortConfig.key.startsWith('percentChange')) {
                const getTimePeriodValue = (token: TokenLeaderboardData, periodKey: string): number | null => {
                    return token[periodKey as keyof TokenLeaderboardData] as number | null;
                };
                valA = getTimePeriodValue(a, sortConfig.key);
                valB = getTimePeriodValue(b, sortConfig.key);
            }


            // Handle nulls: nulls go last when ascending, first when descending
            if (valA === null || valA === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
            if (valB === null || valB === undefined) return sortConfig.direction === 'asc' ? -1 : 1;

            // For BigInts, convert to Number for comparison if they are not null
            if (typeof valA === 'bigint' && typeof valB === 'bigint') {
                valA = Number(valA);
                valB = Number(valB);
            } else if (typeof valA === 'string' && /^\d+$/.test(valA) && typeof valB === 'string' && /^\d+$/.test(valB)) {
                // If they are string representations of numbers (like BigInts from GQL sometimes)
                // This shouldn't be an issue if parseBigInt is used upstream or values are numbers
                try {
                    valA = Number(parseBigInt(valA));
                    valB = Number(parseBigInt(valB));
                } catch { /* ignore, proceed as string */ }
            }


            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
            }
            if (typeof valA === 'string' && typeof valB === 'string') {
                return sortConfig.direction === 'asc'
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }
            return 0;
        });

        return processedTokens;
    }, [allTokens, searchTerm, sortConfig]);

    const handleSortKeyChange = (key: SortableTokenKey) => {
        // If it's the same key, toggle direction, otherwise set to default for that key
        if (sortConfig.key === key) {
            setSortConfig({ key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
        } else {
            // Default sort for rank is asc, for most others desc
            const defaultDirection = (key === 'rank' || key === 'name') ? 'asc' : 'desc';
            setSortConfig({ key, direction: defaultDirection });
        }
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
    if (userError && isAuthenticated) { // Only show user error if they were supposed to be authenticated
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
            />
            <TokenDataTable
                tokens={filteredAndSortedTokens}
                isLoading={tokensLoading && allTokens.length === 0}
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