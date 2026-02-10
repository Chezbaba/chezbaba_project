import useSWR from "swr";
import { fetcher } from "@/lib/utils";

export function useUnreadNotifications(userId?: string) {
    const { data, error, isLoading, mutate } = useSWR(
        userId ? `/api/users/${userId}/notifications?statut=nonlu&pageSize=1` : null,
        fetcher,
        {
            refreshInterval: 30000, // Poll every 30 seconds
            revalidateOnFocus: true,
        }
    );

    return {
        unreadCount: data?.pagination?.totalItems || 0,
        isLoading,
        error,
        mutate,
    };
}
