import SEO from "components/seo";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import TopUsers from "components/topUsers";
import User from "components/user"
import {Divider, Skeleton, Tooltip} from '@mui/material';
import {useSession} from "next-auth/react";
import {useQuery} from "@tanstack/react-query";
import { type } from "os";

function Profile(props: {id: string | string[] | undefined}) {
    const {status} = useSession();
    async function getUser() {
        return await (await fetch(`/api/v1/users/${props.id}`, {
            method: 'GET',
            credentials: 'same-origin'
        }))?.json();
    }

    const isUUID = props.id && typeof props.id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(props.id)
    const {data, isFetching, refetch, isError, error} = useQuery([`user-${props.id}`], getUser, {
        cacheTime: 0,
        refetchOnWindowFocus: false,
        enabled: false // disable this query from automatically running
    });
    const isLoading = isFetching || !isUUID;
    const router = useRouter();
    useEffect(() => {
        if(isUUID)
            refetch();
    }, [router.pathname, isUUID])
    useEffect(() => {
        if(!isUUID)
        {
            router.push("/404");
        }
        if (isError && error) {
            // console.log(`Ошибка ${error}`)
            console.log(error)
            // router.push('/500');
        }
    }, [isError, error, isUUID])

    // if(!isFetching)
        // console.log(data);

    return <div className="flex">
        <div className="lg:mr-8 -mt-2 lg:w-[80%] w-full">
            {isLoading ? <Skeleton variant="rectangular" width="100%" height="100%"/> :
                /* @ts-ignore */
                <User {...data}/>
            }
        </div>
        <div className="ml-auto hidden lg:block">
            <TopUsers/>
        </div>
    </div>;
}


function UserProfile() {
    const router = useRouter();
    const {id} =  router.query;
    return (
        <>
            <SEO title={'Пользователь PotatoHD'}/>
            <div className="flex-wrap w-full space-y-8">
                <Profile id={id}/>
            </div>
        </>
    );

}

export default UserProfile;
