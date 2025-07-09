import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getFolder, getPasswords } from '../../../components/api';
import Folder from './Folder';

export default async function FolderPage({ params }: { params: Promise<{ folderId: string }> }) {
    const { folderId } = await params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['passwords', folderId],
        queryFn: () => getPasswords(folderId)
    });

    await queryClient.prefetchQuery({
        queryKey: ['folder', folderId],
        queryFn: () => getFolder(folderId)
    });

    return (
        <div className="px-2 sm:px-4 md:px-8 max-w-4xl mx-auto w-full">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Folder folderId={folderId} />
            </HydrationBoundary>
        </div>
    );
}
