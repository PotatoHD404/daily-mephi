import SEO from "components/seo";
import {useRouter} from "next/router";
import React, {useEffect} from "react";
import TopUsers from "components/topUsers";
import User from "components/user"
import {useQuery} from "@tanstack/react-query";
import useIsMobile from "lib/react/isMobileContext";
import {GetServerSideProps} from "next";
import { prisma } from "lib/database/prisma";
import {useSession} from "next-auth/react";
import {UUID_REGEX} from "lib/constants/uuidRegex";
import {auth} from "lib/auth";

function Profile({user, me, isLoading}: { user: any, me: boolean, isLoading: boolean}) {
    const {status} = useSession();

    const router = useRouter();
    // if(!isFetching)
    // console.log(data);

    return <div className="flex">
        <div className="lg:mr-8 -mt-2 lg:w-[80%] w-full">
            <User {...(isLoading ? user ?? {} : user)} isLoading={isLoading} me/>
        </div>
        <div className="ml-auto hidden lg:block">
            <TopUsers isLoading={isLoading} place={user?.place}/>
        </div>
    </div>;
}


function UserProfile({user, me, changeNeedsAuth}: { user?: any, me?: boolean, changeNeedsAuth: (a: boolean) => void }) {
    async function getUser() {
        return await (await fetch(`/api/v1/users/${id}`, {
            method: 'GET',
            credentials: 'same-origin'
        }))?.json().then((data) => {
            if (data?.error) {
                changeNeedsAuth(true);
            }
            data.image = data.image?.url;
            return data;
        });
    }

    // @ts-ignore
    const {data, isFetching, refetch, isError, error} = useQuery([`user-${user.id}`], getUser, {
        cacheTime: 0,
        refetchOnWindowFocus: false,
        enabled: false // disable this query from automatically running
    });
    const isLoading = isFetching;
    const router = useRouter();
    const {id} = router.query;
    const {data: session} = useSession();
    // @ts-ignore
    const isMe = session?.user?.id === id;

    useEffect(() => {
        if(id)
            refetch();
    }, [router.pathname, refetch, id])
    useEffect(() => {
        if (isError && error) {
            // console.log(`Ошибка ${error}`)
            console.log(error)
            // router.push('/500');
        }
    }, [isError, error, router])
    const isMobile = useIsMobile();
    useEffect(() => {
        if (me)
            changeNeedsAuth(true);
        // window.onpopstate = () => changeNeedsAuth(true);
    }, [changeNeedsAuth, me]);

    return (
        <>
        {user ?
            <SEO title={`Пользователь ${user.nickname}`}
                 thumbnail={`https://daily-mephi.ru/api/v1/users/${user.id}/thumbnail.png`}/> :
                    // @ts-ignore
                  <SEO title={`Пользователь ${data.name || '...'}`}
                 thumbnail={`https://daily-mephi.ru/api/v1/users/${id}/thumbnail.png`}/>
        }
            {isMobile == null ? null :
                <div className="flex-wrap w-full space-y-8">
                    <Profile me={isMe} user={data ?? user} isLoading={isLoading}/>
                </div>
            }
        </>
    );

}




export const getServerSideProps: GetServerSideProps = async (props) => {
    const {req, query} = props;
    // console.log(props);
    const {id} = query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        return {
            notFound: true
        }
    }
    // get user from database
    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            nickname: true,
            image: {
                select: {
                    url: true
                }
            }
        }
    });
    if (!user) {
        return {
            notFound: true
        }
    }
    const session = await auth(props)

    // res.setHeader(
    //     'Cache-Control',
    //     'public, s-maxage=10, stale-while-revalidate=59'
    // )

    // @ts-ignore
    user.image = user.image?.url ?? null;
    if (user.image) { // @ts-ignore
        delete user.image;
    }
    return {
        props: {user, me: session?.user?.id === user.id}
    }
}

export default UserProfile;
