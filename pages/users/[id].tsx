import SEO from "components/seo";
import {useRouter} from "next/router";
import React, {useEffect} from "react";
import TopUsers from "components/topUsers";
import User from "components/user"
import useIsMobile from "lib/react/isMobileContext";
import {GetServerSideProps} from "next";
import {prisma} from "lib/database/prisma";
import {useSession} from "next-auth/react";
import {UUID_REGEX} from "lib/constants/uuidRegex";
import {getToken} from "next-auth/jwt";
import {Session} from "next-auth";
import {MyAppUser} from "lib/auth/nextAuthOptions";
import {trpc} from "server/utils/trpc";

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


function UserProfile({user, me, changeNeedsAuth}: {
    user?: MyAppUser,
    me?: boolean,
    changeNeedsAuth: (a: boolean) => void
}) {
    const router = useRouter();
    const {id} = router.query;
    const {data: session, status} = useSession() as any as {
        data: Session & { user: MyAppUser },
        status: "authenticated" | "loading" | "unauthenticated"
    };
    const isMobile = useIsMobile();

    // Ensure id is a string

    const validId = typeof id === 'string' && UUID_REGEX.test(id) ? id : null;
    const {data, isFetching, isError, error} = validId ?
        trpc.users.getOne.useQuery({id: validId}) : {
            data: null,
            isFetching: false,
            isError: false,
            error: null
        };
    const isLoading = isFetching;
    const isMe = session?.user?.id === validId;

    useEffect(() => {
        if (isError && error) {
            console.log(error);
        }
    }, [isError, error, router]);

    useEffect(() => {
        if (me) {
            changeNeedsAuth(true);
        }
    }, [changeNeedsAuth, me]);

    // Early return for invalid id
    if (!validId) {
        return (<></>);
    }

    return (
        <>
            {user ?
                <SEO title={`Пользователь ${user.nickname}`}
                     thumbnail={`https://daily-mephi.ru/api/v2/users/${user.id}/thumbnail.png`}/> :
                <SEO title={`Пользователь ${data?.nickname || '...'}`}
                     thumbnail={`https://daily-mephi.ru/api/v2/users/${validId}/thumbnail.png`}/>
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
    const session = await getToken({req})

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
        props: {user, me: session?.sub === user.id}
    }
}

export default UserProfile;
