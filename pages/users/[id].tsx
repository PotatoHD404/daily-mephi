import SEO from "components/seo";
import {useRouter} from "next/router";
import React from "react";
import TopUsers from "components/topUsers";
import User from "components/user"
import useIsMobile from "lib/react/isMobileContext";
import {GetServerSideProps} from "next";
import {prisma} from "lib/database/prisma";
import {useSession} from "next-auth/react";
import {UUID_REGEX} from "lib/constants/uuidRegex";
import {getServerSession, Session} from "next-auth";
import {auth, MyAppUser, selectUser} from "lib/auth/nextAuthOptions";
import {useQuery} from "@tanstack/react-query";

function Profile({user, me, isLoading}: { user: any, me: boolean, isLoading: boolean }) {
    const {status} = useSession() as any as {
        data: Session & { user: MyAppUser },
        status: "authenticated" | "loading" | "unauthenticated"
    };

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


function UserProfile({user, me}: {
    user?: MyAppUser,
    me?: boolean
}) {
    const router = useRouter();
    const {id} = router.query;
    const {data: session, status, update: updateSession} = useSession() as any as {
        data: Session & { user: MyAppUser },
        status: "authenticated" | "loading" | "unauthenticated",
        update: (data?: any) => Promise<Session | null>
    };

    const {data, isFetching, refetch, isError, error} = useQuery({
        queryKey: ['session'],
        enabled: session != null && status === "authenticated",
        queryFn: updateSession
    });


    const isMobile = useIsMobile();

    // Ensure id is a string


    const validId = typeof id === 'string' && UUID_REGEX.test(id) ? id : null;
    const isLoading = status === "loading";


    if (!user) {
        return (<></>);
    }

    // Early return for invalid id
    if (!validId) {
        return (<></>);
    }

    return (
        <>
            <SEO title={`Пользователь ${user.nickname}`}
                 thumbnail={`https://daily-mephi.ru/api/v2/thumbnails/users/${user.id}.png`}/>
            {isMobile == null ? null :
                <div className="flex-wrap w-full space-y-8">
                    <Profile me={me ?? false} user={user} isLoading={isLoading}/>
                </div>
            }
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (props) => {
    const {req, res, query} = props;
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
            id
        },
        ...selectUser
    });

    if (!user) {
        return {
            notFound: true
        }
    }
    const session = await auth(req, res);

    // res.setHeader(
    //     'Cache-Control',
    //     'public, s-maxage=10, stale-while-revalidate=59'
    // )

    return {
        props: {user, me: (session?.user as any)?.id === user.id}
    }
}

export default UserProfile;
