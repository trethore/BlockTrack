// src/pages/FavoritesPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, NetworkStatus, ApolloError as ApolloErrorType } from '@apollo/client';
import { GraphQLFormattedError } from 'graphql';
import { GET_ME, REMOVE_FAVORITE_TOKEN } from '@/lib/apollo/queries.ts';
import { useCachedLeaderboard } from '@/lib/hooks/useCachedLeaderboard.ts';
import { TokenLeaderboardData, SortConfig, SortableTokenKey, SortDirection, DEFAULT_SORT_DIRECTION, ChartTimeframe, DEFAULT_CHART_TIMEFRAME } from '@/types/token.ts';
import LeaderboardControls from '@/components/leaderboard/LeaderboardControls.tsx';
import TokenDataTable from '@/components/leaderboard/TokenDataTable.tsx';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { Button } from '@/components/ui/button.tsx';

const ACCESS_TOKEN_KEY = 'AccessToken';
const DEFAULT_FAV_SORT_KEY: SortableTokenKey = 'marketCapUsd';

const FavoritesPage: React.FC = () => {
    const [allTokens, setAllTokens] = useState<TokenLeaderboardData[]>([]);
    const [displayedFavoriteTokens, setDisplayedFavoriteTokens] = useState<TokenLeaderboardData[]>([]);
    const [userFavoritesSet, setUserFavoritesSet] = useState<Set<string>>(new Set());
    // TODO: implement optimistic updates for favorites might be better for user experience
    const [optimisticFavoritesSet, setOptimisticFavoritesSet] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: DEFAULT_FAV_SORT_KEY, direction: DEFAULT_SORT_DIRECTION });
    const [selectedTimePeriod, setSelectedTimePeriod] = useState<ChartTimeframe>(DEFAULT_CHART_TIMEFRAME);
    const [favoriteMutationLoading, setFavoriteMutationLoading] = useState<Record<string, boolean>>({});

    const { loading: userLoading, error: userError, data: userData, refetch: refetchUser, networkStatus: userNetworkStatus } = useQuery(GET_ME, {
        skip: !localStorage.getItem(ACCESS_TOKEN_KEY),
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    });

    const {
        tokens: leaderboardApiTokens,
        loading: tokensLoading, // Ce loading concerne le leaderboard
        error: tokensError,
        refetchLeaderboard
    } = useCachedLeaderboard();

    const [removeFavoriteTokenMutation] = useMutation(REMOVE_FAVORITE_TOKEN);

    const isAuthenticated = !!userData?.me && !!localStorage.getItem(ACCESS_TOKEN_KEY);
    const isAuthLoading = userLoading && userNetworkStatus !== NetworkStatus.ready && userNetworkStatus !== NetworkStatus.error;

    // --- Effects ---
    useEffect(() => {
        if (leaderboardApiTokens) {
            const processedTokens = leaderboardApiTokens.map((token: any) => ({
                // ... votre logique de processing existante ...
                ...token,
                circulatingSupply: token.circulatingSupply,
                totalSupply: token.totalSupply,
                maxSupply: token.maxSupply,
            })) as TokenLeaderboardData[];
            setAllTokens(processedTokens);
        }
    }, [leaderboardApiTokens]);

    useEffect(() => {
        if (userData?.me?.favorites) {
            const newFavSet = new Set((userData.me.favorites as { id: string }[]).map(fav => fav.id));
            setUserFavoritesSet(newFavSet);
            setOptimisticFavoritesSet(newFavSet);
        } else {
            setUserFavoritesSet(new Set());
            setOptimisticFavoritesSet(new Set());
        }
    }, [userData]);

    useEffect(() => {
        if (allTokens.length > 0 && userFavoritesSet.size >= 0) {
            const favs = allTokens.filter(token => userFavoritesSet.has(token.id));
            setDisplayedFavoriteTokens(favs);
        } else {
            setDisplayedFavoriteTokens([]);
        }
    }, [allTokens, userFavoritesSet]); // Depends on actual set

    const handleRemoveFavorite = async (tokenId: string) => {
        if (!isAuthenticated || isAuthLoading) {
            toast.error("Please log in to manage favorites.");
            return;
        }
        if (favoriteMutationLoading[tokenId]) return;

        setFavoriteMutationLoading(prev => ({ ...prev, [tokenId]: true }));

        const originalOptimisticSet = new Set(optimisticFavoritesSet);
        const newOptimisticSet = new Set(originalOptimisticSet);
        newOptimisticSet.delete(tokenId);
        setOptimisticFavoritesSet(newOptimisticSet);

        try {
            await removeFavoriteTokenMutation({ variables: { tokenId } });
            toast.success(`Token removed from favorites.`);
            await refetchUser();

        } catch (error: any) {
            const apolloError = error as ApolloErrorType; // Type assertion
            let errorMessage = "Failed to remove from favorites.";
            if (apolloError.message) {
                errorMessage = apolloError.message;
            }

            toast.error(errorMessage);
            console.error("Remove favorite error:", apolloError);

            setOptimisticFavoritesSet(originalOptimisticSet);

            const isDesyncError = apolloError.graphQLErrors?.some(
                (e: GraphQLFormattedError) => (e.extensions?.code as string)?.includes('NOT_FOUND') ||
                    e.message.toLowerCase().includes('not in your favorites') ||
                    e.message.toLowerCase().includes('not found')
            );

            if (isDesyncError) {
                toast.info("Your favorites list might be out of sync. Refreshing...");
                await refetchUser();
            }
        } finally {
            setFavoriteMutationLoading(prev => ({ ...prev, [tokenId]: false }));
        }
    };

    const handleRefresh = () => {
        toast.info("Refreshing data...");
        refetchUser(); // Rafraîchit les favoris de l'utilisateur
        refetchLeaderboard(); // Rafraîchit les données du leaderboard (passera par la logique de cache)
    }

    const isRefreshing = tokensLoading || userNetworkStatus === NetworkStatus.refetch;

    const filteredAndSortedTokens = useMemo(() => {
        let processedTokens = [...displayedFavoriteTokens];

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
    }, [displayedFavoriteTokens, searchTerm, sortConfig]);

    const overallLoading = (userLoading && !userData) || (tokensLoading && (!allTokens || allTokens.length === 0));

    if (overallLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Loading Favorites...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4 space-y-4">
                <Alert className="max-w-md">
                    <AlertTitle>Login Required</AlertTitle>
                    <AlertDescription>Favorites are a user-only feature. Please log in to use it!</AlertDescription>
                </Alert>
                <Button asChild>
                    <Link to="/account">Go to Login</Link>
                </Button>
            </div>
        );
    }

    if (tokensError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Error loading token data</AlertTitle>
                    <AlertDescription>{tokensError.message}</AlertDescription>
                </Alert>
                <Button onClick={() => refetchLeaderboard()} className="mt-4">Try Again</Button>
            </div>
        );
    }

    if (userError) {
        toast.error(`Error loading your favorites: ${userError.message}`);
    }

    if (isAuthenticated && !userLoading && userFavoritesSet.size === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4 space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Your Favorites List is Empty</h2>
                <p className="text-muted-foreground">
                    Uh oh! You haven't added any favorites yet.
                </p>
                <Button asChild variant="outline">
                    <Link to="/leaderboard">Explore Leaderboard</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <LeaderboardControls
                title="Your Favorite Cryptos"
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortConfig={sortConfig}
                onSortKeyChange={(key) => setSortConfig(prev => ({ ...prev, key }))}
                onSortDirectionChange={(dir) => setSortConfig(prev => ({ ...prev, direction: dir }))}
                selectedTimePeriod={selectedTimePeriod}
                onTimePeriodChange={setSelectedTimePeriod}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
            />
            <TokenDataTable
                tokens={filteredAndSortedTokens}
                // Le isLoading de TokenDataTable devrait refléter le chargement des données spécifiques à cette table.
                // Si displayedFavoriteTokens est vide parce que allTokens ou userFavoritesSet ne sont pas encore prêts.
                isLoading={(tokensLoading && (!allTokens || allTokens.length === 0)) || (userLoading && userFavoritesSet.size === 0 && isAuthenticated)}
                selectedTimePeriod={selectedTimePeriod}
                userFavorites={userFavoritesSet}
                optimisticFavorites={optimisticFavoritesSet}
                onFavoriteToggle={handleRemoveFavorite}
                favoriteMutationLoading={favoriteMutationLoading}
                isAuthLoading={isAuthLoading}
                isAuthenticated={isAuthenticated}
                showRank={true}
            />
        </div>
    );
};

export default FavoritesPage;