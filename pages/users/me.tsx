import SEO from "components/seo";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import TopUsers from "components/topUsers";
import User from "components/user"
import {Divider, Skeleton, Tooltip} from '@mui/material';
import {useSession} from "next-auth/react";
import {useQuery} from "@tanstack/react-query";
// import ProfileSettings from "components/profileSettings";



function Profile() {
    const {status} = useSession();
    async function getUser() {
        return await (await fetch('/api/v1/users/me', {
            method: 'GET',
            credentials: 'same-origin'
        }))?.json();
    }

    const {data, isFetching, refetch, isError, error} = useQuery([`user-me`], getUser, {
        cacheTime: 0,
        refetchOnWindowFocus: false,
        enabled: false // disable this query from automatically running
    });
    const router = useRouter();
    const authenticated = status === "authenticated";
    const loading = status === "loading";
    const isLoading = loading || isFetching || !data;
    useEffect(() => {
        if(authenticated)
            refetch();
    }, [router.pathname, authenticated, refetch])
    if (isError) {
        // console.log(`Ошибка ${error}`)

        router.push('/500');
    }
    // if(!isFetching)
        // console.log(data);

    return <div className="flex">
        <div className="lg:mr-8 -mt-2 lg:w-[80%] w-full">
                <User {...data} isLoading={isLoading} me/>
        </div>
        <div className="ml-auto hidden lg:block">
            <TopUsers isLoading={isLoading} place={data?.place}/>
        </div>
    </div>;
}


function Me({changeNeedsAuth}: {changeNeedsAuth: (a: boolean) => void}) {
    useEffect(() => {
        changeNeedsAuth(true);
        // window.onpopstate = () => changeNeedsAuth(true);
        }, [changeNeedsAuth]);
    return (
        <>
            <SEO title={'Профиль'}/>
            <div className="flex-wrap w-full space-y-8">
                <Profile/>
                {/*<ProfileSettings/>*/}
            </div>
        </>
    );

}

export default Me;
