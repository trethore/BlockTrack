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
            fetchPolicy: 'cache-first', // Lire depuis le cache d'abord
            notifyOnNetworkStatusChange: true, // Utile si on veut des indicateurs de chargement plus fins
            onCompleted: () => {
                // Mettre à jour le timestamp après chaque fetch/refetch réussi
                localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
                // console.log('Leaderboard data fetched/refreshed, timestamp updated.');
            },
            onError: (e) => {
                console.error("Error fetching leaderboard in hook:", e);
                // Optionnel : si une erreur réseau se produit, on pourrait vouloir supprimer le timestamp
                // pour forcer un refetch la prochaine fois, mais attention aux boucles d'erreurs.
                // localStorage.removeItem(CACHE_TIMESTAMP_KEY);
            }
        }
    );

    useEffect(() => {
        const lastFetchTimeStr = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        const now = Date.now();

        if (lastFetchTimeStr) {
            const lastFetchTime = parseInt(lastFetchTimeStr, 10);
            if (now - lastFetchTime > TEN_MINUTES_MS) {
                // console.log('Leaderboard cache is stale (older than 10 minutes), refetching...');
                refetch().catch(e => console.warn("Refetch failed in stale check:", e));
            } else {
                // console.log('Leaderboard cache is fresh.');
            }
        } else {
            // Pas de timestamp :
            // 1. Premier chargement de l'app -> 'cache-first' va fetch si le cache Apollo est vide,
            //    et 'onCompleted' mettra le timestamp.
            // 2. localStorage a été vidé -> Si le cache Apollo a des données, 'cache-first' les utilisera.
            //    On veut peut-être refetch pour s'assurer que les données sont à jour et pour (ré)établir le timestamp.
            if (data?.tokens && data.tokens.length > 0) { // Si on a des données du cache Apollo mais pas de timestamp
                // console.log('Data found in Apollo cache, but no timestamp. Refetching to ensure freshness and set timestamp.');
                refetch().catch(e => console.warn("Refetch failed in no-timestamp check:", e));
            }
            // Si !data (cache Apollo vide), 'cache-first' a déjà déclenché un fetch, 'onCompleted' s'en occupera.
        }
        // `data` est inclus pour le cas où les données sont chargées depuis le cache Apollo
        // mais qu'il n'y a pas de timestamp (par ex. après un clear de localStorage).
    }, [refetch, data]);

    return {
        tokens: data?.tokens,
        loading,
        error,
        refetchLeaderboard: refetch,
    };
};