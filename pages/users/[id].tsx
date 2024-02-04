import SEO from "components/seo";
import {useRouter} from "next/router";
import React from "react";
import TopUsers from "components/topUsers";
import User from "components/user"
import useIsMobile from "lib/react/isMobileContext";
import {GetServerSideProps} from "next";
import {UUID_REGEX} from "lib/constants/uuidRegex";
import {auth, MyAppUser} from "../../lib/auth/nextAuthOptions";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useQuery} from "@tanstack/react-query";
import {helpersFactory} from "../../server";
import {trpc} from "../../server/utils/trpc";
import SignIn from "../signin";
import RippledButton from "../../components/rippledButton";
import Image from "next/image";
import QuestionIco from "../../images/question.svg";
import AuthIco from "../../images/auth.svg";
import {Tooltip} from "@mui/material";
import Custom404 from "../404";

function Profile({user, me, isLoading}: {
    user?: any,
    me: boolean,
    isLoading: boolean
}) {
    // if(!isFetching)
    // console.log(data);
    const [open, setOpen] = React.useState(false);

    return (
        <div className="flex-wrap">
            <div className="flex">
                <div className="lg:mr-8 -mt-2 lg:w-[80%] w-full">
                    <User user={user} isLoading={isLoading} me={me}/>
                </div>
                <div className="ml-auto hidden lg:block">
                    <TopUsers isLoading={isLoading} place={user?.place} take={4}/>
                </div>

            </div>
            {me ?
                (
                    <div className="w-full normal-case h-fit whiteBox p-5 px-12 relative mt-6">
                        <div>
                            <h2 className={"text-center font-bold text-xl"}>Настройки</h2>
                            <div className="bg-black rounded w-full h-[1px] mb-6 mt-1"/>
                        </div>

                        <div className="w-full flex flex-wrap">
                            <div className="md:w-full w-fit mx-auto md:mx-0 mb-4 flex flex-nowrap">
                                <Image src={AuthIco}
                                       alt="Question icon"
                                       className="w-6 h-6 mr-2"
                                />
                                <h3 className="text-xl font-semibold w-fit">Способы входа</h3>
                                <Tooltip
                                    title={
                                        <div className="text-sm">
                                            Вы можете привязать дополнительные аккаунты, чтобы не потерять аккаунт даже,
                                            когда
                                            вы выпуститесь из МИФИ
                                        </div>
                                    }
                                    open={open}
                                    onOpen={() => setOpen(true)}
                                    onClose={() => setOpen(false)}
                                >
                                    <div className="ml-2 my-auto w-fit">
                                        <RippledButton
                                            onClick={() => setOpen(!open)}
                                            className="w-fit rounded-full"
                                        >
                                            <Image src={QuestionIco}
                                                   alt="Question icon"
                                                   className="w-6 h-6"
                                            />
                                        </RippledButton>
                                    </div>
                                </Tooltip>
                            </div>
                            <div className="md:pl-8 px-4 mx-auto">
                                <SignIn profile={true}/>
                            </div>
                        </div>
                    </div>
                ) : null}
        </div>);
}


function UserProfile({session: serverSession, id: serverId}: { session?: Session & { user: MyAppUser }, id?: string }) {

    // @ts-ignore
    // isSSR = false;
    const router = useRouter();
    const {id: queryId} = router.query;
    const id = queryId ?? serverId;

    // state is updated
    const [isUpdated, setIsUpdated] = React.useState(false);

    const {status, update: updateSession, data: clientSession} = useSession() as any as {
        data: Session & { user: MyAppUser },
        status: "authenticated" | "loading" | "unauthenticated",
        update: (data?: any) => Promise<Session | null>
    };

    const session = clientSession ?? serverSession;

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
        return Custom404()
    }


    const {data: user, isFetching: isFetching2, error} = trpc.users.getOne.useQuery({id})

    if (error?.data?.code == 'NOT_FOUND') {
        return Custom404()
    }

    const isFetching = isFetching1 || isFetching2;
    const me = session?.user?.id === user?.id && session !== undefined;


    return (
        <>
            <SEO title={user ? `Пользователь ${user.nickname}` : 'Загрузка...'}
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
    const session = await auth(req, res)

    // res.setHeader(
    //     'Cache-Control',
    //     'public, s-maxage=10, stale-while-revalidate=59'
    // )


    return {
        props: {
            session,
            id,
            trpcState: helpers.dehydrate(),
        }
    }
}

export default UserProfile;
