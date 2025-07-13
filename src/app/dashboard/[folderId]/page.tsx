import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getFolderApi, getPasswordsApi } from '../../../components/api';
import FolderComponent from './FolderComponent';

export default async function FolderPage({ params }: { params: Promise<{ folderId: string }> }) {
    const { folderId } = await params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['passwords', folderId],
        queryFn: () => getPasswordsApi(folderId)
    });

    await queryClient.prefetchQuery({
        queryKey: ['folder', folderId],
        queryFn: () => getFolderApi(folderId)
    });

    return (
        <div className="w-full">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <FolderComponent folderId={folderId} />
            </HydrationBoundary>
        </div>
    );
}
