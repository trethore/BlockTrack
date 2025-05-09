import { useQuery, ApolloError } from '@apollo/client';
import { GET_TOKENS_FOR_LEADERBOARD } from '@/lib/apollo/queries.ts';
import { TokenLeaderboardData } from '@/types/token.ts';
import { useEffect } from 'react';

const CACHE_TIMESTAMP_KEY = 'leaderboardLastFetchTime';
const TEN_MINUTES_MS = 10 * 60 * 1000;

interface GetTokensQueryData {
    tokens: TokenLeaderboardData[];
}

interface UseCachedLeaderboardResult {
    tokens: TokenLeaderboardData[] | undefined;
    loading: boolean;
    error: ApolloError | undefined;
    refetchLeaderboard: () => Promise<any>;
}

export const useCachedLeaderboard = (): UseCachedLeaderboardResult => {
    const { data, loading, error, refetch } = useQuery<GetTokensQueryData>(
        GET_TOKENS_FOR_LEADERBOARD,
        {
            fetchPolicy: 'cache-first',
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
            },
            onError: (e) => {
                console.error("Error fetching leaderboard in hook:", e);
            }
        }
    );

    useEffect(() => {
        const lastFetchTimeStr = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        const now = Date.now();

        if (lastFetchTimeStr) {
            const lastFetchTime = parseInt(lastFetchTimeStr, 10);
            if (now - lastFetchTime > TEN_MINUTES_MS) {
                refetch().catch(e => console.warn("Refetch failed in stale check:", e));
            } else {
            }
        } else {
            if (data?.tokens && data.tokens.length > 0) {
                refetch().catch(e => console.warn("Refetch failed in no-timestamp check:", e));
            }
        }
    }, [refetch, data]);

    return {
        tokens: data?.tokens,
        loading,
        error,
        refetchLeaderboard: refetch,
    };
};