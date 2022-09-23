import SEO from "components/seo";
import {useRouter} from "next/router";
import React, {useEffect} from "react";
import TopUsers from "components/topUsers";
import User from "components/user"
import {useQuery} from "@tanstack/react-query";
import useIsMobile from "../../helpers/react/isMobileContext";
import {NextApiRequest} from "next";
import prisma from "../../lib/database/prisma";
import {getToken} from "next-auth/jwt";
import {useSession} from "next-auth/react";

function Profile({user}: { user: any }) {
    async function getUser() {
        return await (await fetch(`/api/v1/users/${user.id}`, {
            method: 'GET',
            credentials: 'same-origin'
        }))?.json();
    }

    const {data, isFetching, refetch, isError, error} = useQuery([`user-${user.id}`], getUser, {
        cacheTime: 0,
        refetchOnWindowFocus: false,
        enabled: false // disable this query from automatically running
    });
    const isLoading = isFetching || !data;
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
    }, [isError, error, router])

    // if(!isFetching)
    // console.log(data);

    return <div className="flex">
        <div className="lg:mr-8 -mt-2 lg:w-[80%] w-full">
            <User {...(isLoading ? user : data)} isLoading={isLoading}/>
        </div>
        <div className="ml-auto hidden lg:block">
            <TopUsers place={data?.place} isLoading={isLoading}/>
        </div>
    </div>;
}

function Me({user}: { user: any }) {
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
        if (authenticated)
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
            <User {...(isLoading ? user : data)} isLoading={isLoading} me/>
        </div>
        <div className="ml-auto hidden lg:block">
            <TopUsers isLoading={isLoading} place={data?.place}/>
        </div>
    </div>;
}


function UserProfile({user, me, changeNeedsAuth}: { user: any, me: boolean, changeNeedsAuth: (a: boolean) => void }) {
    const isMobile = useIsMobile();
    useEffect(() => {
        if (me)
            changeNeedsAuth(true);
        // window.onpopstate = () => changeNeedsAuth(true);
    }, [changeNeedsAuth, me]);
    return (
        <>
            <SEO title={`Пользователь ${user.name}`}
                 thumbnail={`https://daily-mephi.ru/api/v1/thumbnails/users/${user.id}.png`}/>
            {isMobile == null ? null :
                <div className="flex-wrap w-full space-y-8">
                    {me ? <Me user={user}/> : <Profile user={user}/>}
                </div>
            }
        </>
    );

}

export async function getServerSideProps({req}: { req: NextApiRequest }): Promise<any> {
    const id = req.url?.split('/').pop()?.split('.')[0];
    const isUUID = id && typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)
    if (!isUUID) {
        return {
            redirect: {
                destination: '/404',
                permanent: true,
            },
        }
    }
    // get user from database
    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            name: true,
            image: {
                select: {
                    url: true
                }
            }
        }
    });
    if (!user) {
        return {
            redirect: {
                destination: '/404',
                permanent: true,
            },
        }
    }
    const session = await getToken({req})

    // res.setHeader(
    //     'Cache-Control',
    //     'public, s-maxage=10, stale-while-revalidate=59'
    // )

    // @ts-ignore
    user.image = user.image?.url ?? null;
    if(user.image)
        { // @ts-ignore
            delete user.image;
        }
    return {
        props: {user, me: session?.sub === user.id}
    }
}


export default UserProfile;
