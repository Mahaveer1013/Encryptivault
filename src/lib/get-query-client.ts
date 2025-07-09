import { QueryClient, isServer } from '@tanstack/react-query';

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60,
            },
        },
    });
}

let browserClient: QueryClient | undefined = undefined;

export function getQueryClient() {
    if (isServer) {
        return makeQueryClient();
    }else{
        if (!browserClient) {
            browserClient = makeQueryClient();
        }
        return browserClient;
    }
}

export default makeQueryClient;
