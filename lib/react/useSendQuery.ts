import {useQuery} from "@tanstack/react-query";
import {useRouter} from "next/router";
import {useEffect} from "react";

export default function useSendQuery(queryKey: string, queryFunc: () => Promise<any>) {
    const result = useQuery([queryKey], queryFunc, {
        cacheTime: 0,
        refetchOnWindowFocus: false,
        enabled: false // disable this query from automatically running
    });
    const {refetch, isError, error} = result;

    const router = useRouter();
    useEffect(() => {
        refetch();
    }, [router.pathname, refetch])
    useEffect(() => {
        if (isError && error) {
            // console.log(`Ошибка ${error}`)
            console.log(error)
            // router.push('/500');
        }
    }, [isError, error, router.pathname])
    return result;
}
