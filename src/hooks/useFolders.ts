import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useFolders() {
    return useQuery({
        queryKey: ['folders'],
        queryFn: async () => {
            const res = await fetch('/api/folders');
            if (!res.ok) throw new Error('Failed to fetch folders');
            return res.json();
        },
    });
}

export function useCreateFolder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (body: any) => {
            const res = await fetch('/api/folders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error('Failed to create folder');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders'] });
        },
    });
}
