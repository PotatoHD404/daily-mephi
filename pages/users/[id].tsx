import SEO from "components/seo";
import {useRouter} from "next/router";
import React from "react";
import TopUsers from "components/topUsers";
import User from "components/user"
import useIsMobile from "lib/react/isMobileContext";
import {GetServerSideProps} from "next";
// import {useSession} from "next-auth/react";
import {UUID_REGEX} from "lib/constants/uuidRegex";
// import {Session} from "next-auth";
// import {MyAppUser, selectUser} from "lib/auth/nextAuthOptions";
// import {useQuery} from "@tanstack/react-query";
import {ProvidersProps} from "../../lib/react/getProviders";
import {auth, MyAppUser} from "../../lib/auth/nextAuthOptions";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useQuery} from "@tanstack/react-query";
import {providerProps} from "../../lib/react/providerProps";
import {helpers, helpersFactory} from "../../server";
import {getQueryKey} from "@trpc/react-query";
import {RouterOutputs, trpc} from "../../server/utils/trpc";

function Profile({user, me, isLoading}: {
    user?: any,
    me: boolean,
    isLoading: boolean
}) {
    // if(!isFetching)
    // console.log(data);

    return <div className="flex">
        <div className="lg:mr-8 -mt-2 lg:w-[80%] w-full">
            <User user={user} isLoading={isLoading} me={me}/>
        </div>
        <div className="ml-auto hidden lg:block">
            <TopUsers isLoading={isLoading} place={user?.place}/>
        </div>
    </div>;
}


function UserProfile({me: serverMe, id: serverId}: { me?: boolean, id?: string }) {

    // @ts-ignore
    // isSSR = false;
    const router = useRouter();
    const {id: queryId} = router.query;
    const id = serverId ?? queryId;

    // state is updated
    const [isUpdated, setIsUpdated] = React.useState(false);

    const {status, update: updateSession, data: session} = useSession() as any as {
        data: Session & { user: MyAppUser },
        status: "authenticated" | "loading" | "unauthenticated",
        update: (data?: any) => Promise<Session | null>
    };
    // providerProps
    const {isFetching: isFetching1} = useQuery({
        queryKey: ['session'],
        enabled: (status === "authenticated" || isUpdated),
        queryFn: async () => {
            setIsUpdated(true);
            return updateSession()
        },
        refetchOnWindowFocus: false
    });
    const isMobile = useIsMobile();

    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        router.push("/404")
        return;
    }


    const {data: user, isFetching: isFetching2} = trpc.users.getOne.useQuery({id})
    const isFetching = isFetching1 || isFetching2;
    const me = serverMe ?? session?.user.id === user?.id;


    return (
        <>
            <SEO title={`Пользователь ${user?.nickname}`}
                 thumbnail={`https://daily-mephi.ru/api/v2/thumbnails/users/${user?.id}.png`}/>
            {isMobile == null ? null :
                <div className="flex-wrap w-full space-y-8">
                    <Profile me={me} user={user}
                             isLoading={isFetching}/>
                </div>
            }
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (props) => {
    const {req, res, query} = props;
    // @ts-ignore
    const helpers = helpersFactory({req, res});
    // console.log(props);
    const {id} = query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        return {
            notFound: true
        }
    }

    await helpers.users.getOne.prefetch({id}).catch((e) => {
        // if 404 return null, else throw
        if (e.code === "NOT_FOUND") {
            return null;
        }
        throw e;
    });
    const usersKey = getQueryKey(trpc.users.getOne, undefined, 'query');
    const user = helpers.queryClient.getQueryData(usersKey) as RouterOutputs['users']['getOne'];

    if (!user) {
        return {
            notFound: true
        }
    }
    const session = await auth(req, res)

    // res.setHeader(
    //     'Cache-Control',
    //     'public, s-maxage=10, stale-while-revalidate=59'
    // )


    return {
        props: {
            me: user.id === session.user.id,
            id,
            trpcState: helpers.dehydrate(),
        }
    }
}

export default UserProfile;
