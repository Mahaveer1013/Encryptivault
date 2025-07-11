import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Dashboard from './Dashboard';
import { getFoldersApi } from '../../components/api';

export default async function DashboardPage() {

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ['folders'],
        queryFn: getFoldersApi
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Dashboard />
        </HydrationBoundary>
    );
}
