import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function usePasswords(folderId: string | null) {
    return useQuery({
        queryKey: ['passwords', folderId],
        queryFn: async () => {
            if (!folderId) return [];
            const res = await fetch(`/api/passwords?folder=${folderId}`);
            if (!res.ok) throw new Error('Failed to fetch passwords');
            return res.json();
        },
        enabled: !!folderId,
    });
}

export function useCreatePassword() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (body: any) => {
            const res = await fetch('/api/passwords', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error('Failed to add password');
            return res.json();
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['passwords', variables.folder] });
        },
    });
}
