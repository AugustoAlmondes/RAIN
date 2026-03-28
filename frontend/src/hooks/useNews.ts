import { fetchNews } from '@/services/newsService'
import {
    useQuery,
} from '@tanstack/react-query'

export function useNews(){
    return useQuery({
        queryKey: ["news"],
        queryFn: fetchNews,
        staleTime: 1000 * 60 * 5,
    })
}