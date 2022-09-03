/*  ./components/Navbar.jsx     */
import Link from 'next/link';
import React, {useEffect} from 'react';
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import NewsIcon from "images/news.svg";
import MaterialsIcon from "images/materials.svg";
import TutorsIcon from "images/news.svg";
// import NewsIcon from "@mui/icons-material/News";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import SwappableDrawer from "@mui/material/SwipeableDrawer";
import WarningDialog from 'components/warning';
import {useRouter} from "next/router";
import Image from "next/future/image";
import miniCat from 'images/minicat_transparent.svg'
import burger from 'images/burger.svg'
import {getSession, signOut, useSession} from "next-auth/react";
import {Session} from "next-auth";
import MiniCat from "images/minicat.svg";
import style from "styles/navbar.module.css";
import {inspect} from "util";
import {ListItemButton} from "@mui/material";


interface DefaultNavbarParams {
    handleClickOpenWarning: () => void;
    toggleDrawer: () => void;
}

function Minicat() {
    return <svg viewBox="0 0 45 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="group">
        <path
            d="M40.9606 14.6099C40.9794 10.8081 40.923 7.02517 40.8102 3.2234C40.7914 2.43293 39.8139 2.00005 39.2311 2.56467C37.5016 4.27735 35.4337 6.29117 33.065 7.10046C32.9334 6.83697 32.6702 6.62994 32.2567 6.66758C31.0723 6.72404 29.8692 6.70522 28.6848 6.64875C28.5532 6.59229 28.4216 6.55465 28.2525 6.57347C28.1397 6.59229 28.0457 6.5923 27.9329 6.61112C27.3877 6.57348 26.8613 6.53583 26.3162 6.49819C26.0906 6.46055 25.8462 6.44173 25.6206 6.44173C23.0827 6.2347 20.5636 5.97121 18.0258 5.99003C15.7323 6.00885 13.514 6.55465 11.2393 6.64875C10.6189 6.66758 10.149 6.62994 9.67898 6.21588C9.2466 5.83947 8.87062 5.40659 8.45704 5.01136C7.74268 4.315 7.04711 3.59981 6.33275 2.90344C6.35155 2.79052 6.35155 2.6776 6.37035 2.56467C6.46435 1.54836 5.12961 1.41661 4.67843 2.1318C4.20846 2.35764 3.88887 2.90345 4.26485 3.39278C4.32125 3.46807 4.37765 3.52453 4.41524 3.59981C3.81367 9.75417 3.3813 15.9085 3.98287 22.1005C4.24605 24.7919 4.52804 27.5585 5.59958 30.0617C6.67113 32.5272 8.56984 34.2963 11.0701 35.275C13.8712 36.3854 16.9542 36.3666 19.9245 36.423C23.1391 36.4795 26.4477 36.7618 29.6624 36.5172C32.5762 36.2913 34.9261 34.9362 36.7684 32.6966C36.8436 32.6025 36.9188 32.5084 36.994 32.4142C37.276 32.339 37.5016 32.1508 37.5956 31.7932C37.6144 31.7367 37.6144 31.6802 37.6332 31.6238C39.1183 29.7041 40.2463 27.7091 40.6222 25.1871C41.111 21.7241 40.9418 18.1105 40.9606 14.6099Z"
            className="ease-in-out duration-300 group-hover:fill-white fill-transparent" fill="white"/>
        <path
            d="M3.64451 27.615C3.49412 27.088 3.45652 26.5611 3.36252 26.0341C3.30613 25.733 3.28733 25.413 3.26853 25.1119C3.26853 24.9425 3.21213 24.886 3.06173 24.8296C2.25337 24.5473 1.46381 24.2649 0.674249 23.9826C0.617852 23.9638 0.580256 23.945 0.523859 23.9262C0.129078 23.7756 -0.0589146 23.418 0.0162817 22.9663C0.0726789 22.6087 0.411062 22.2888 0.768244 22.2511C0.918637 22.2323 1.05023 22.2699 1.18183 22.3264C1.7834 22.5334 2.38497 22.7593 2.98654 22.9663C3.06174 22.9851 3.11813 23.0228 3.21212 23.0228C3.26852 22.9663 3.24972 22.891 3.24972 22.8346C3.24972 22.7593 3.24972 22.684 3.24972 22.6087C3.24972 15.3628 3.24972 8.11681 3.24972 0.870848C3.24972 0.814386 3.24972 0.757925 3.24972 0.701463C3.23092 0.174484 3.8137 -0.183111 4.30248 0.0991994C4.41527 0.155661 4.50926 0.249767 4.60326 0.32505C6.85915 2.11301 9.13383 3.90098 11.3897 5.68894C11.5401 5.80187 11.6717 5.85832 11.8597 5.80186C12.5553 5.67012 13.2508 5.53837 13.9652 5.42545C14.5668 5.33134 15.1683 5.27488 15.7511 5.18078C16.7851 5.03022 17.819 4.95493 18.853 4.89847C20.5073 4.78555 22.1804 4.74791 23.8535 4.80437C24.1543 4.82319 24.4551 4.82319 24.7559 4.82319C25.4326 4.82319 26.1094 4.89847 26.7862 4.95493C27.2749 4.99257 27.7637 5.03022 28.2713 5.08668C28.9857 5.16196 29.7 5.27488 30.4144 5.35017C31.2791 5.46309 32.1439 5.6513 33.0086 5.80186C33.1966 5.8395 33.3094 5.78304 33.441 5.68894C35.6217 3.95744 37.8212 2.22594 40.0019 0.513256C40.1335 0.400332 40.2651 0.306227 40.3967 0.193303C40.6411 0.00509604 40.9231 -0.0701878 41.2239 0.0803776C41.5058 0.230943 41.5998 0.475615 41.5998 0.795567C41.5998 4.12683 41.5998 7.4769 41.5998 10.8082C41.5998 14.7793 41.5998 18.7505 41.5998 22.7217C41.5998 22.8346 41.581 22.9475 41.6186 23.0792C41.7126 23.1169 41.8066 23.0604 41.8818 23.0228C42.5398 22.7969 43.1978 22.5523 43.8557 22.3264C44.3069 22.1758 44.7017 22.3452 44.9085 22.7593C45.1341 23.211 44.9273 23.7568 44.4573 23.9262C43.6113 24.2273 42.7466 24.5284 41.9006 24.8296C41.8066 24.8672 41.6938 24.886 41.5998 24.9801C41.5434 25.8459 41.4118 26.7304 41.2426 27.5962C41.3554 27.6527 41.487 27.6527 41.5998 27.6527C42.2014 27.6527 42.7842 27.6715 43.3857 27.6715C43.5361 27.6715 43.6677 27.6715 43.8181 27.6715C44.2693 27.6903 44.4761 27.8032 44.6077 28.1796C44.7393 28.5561 44.6453 29.0266 44.3821 29.2712C44.2693 29.3842 44.1189 29.403 43.9685 29.403C43.0286 29.3842 42.0886 29.3654 41.1487 29.3465C40.9983 29.3465 40.8667 29.3465 40.7539 29.3465C40.6787 29.3842 40.6787 29.4406 40.6599 29.4783C40.0395 31.0404 39.1371 32.4331 37.9528 33.6188C37.0317 34.5598 35.9789 35.3315 34.8134 35.9526C33.5538 36.6113 32.2379 37.0818 30.8468 37.3641C30.2076 37.4959 29.5684 37.5523 28.9105 37.5523C24.6619 37.5335 20.3945 37.5335 16.1459 37.5523C15.2247 37.5523 14.3224 37.4394 13.4388 37.2324C12.1417 36.9313 10.9009 36.4419 9.7354 35.7832C8.56986 35.1245 7.53591 34.2964 6.63356 33.2989C5.95679 32.546 5.37402 31.7368 4.88524 30.8522C4.65966 30.4381 4.45287 30.0053 4.26488 29.5536C4.24608 29.4971 4.22728 29.4406 4.18968 29.403C4.09568 29.3465 3.98289 29.3653 3.8889 29.3653C2.98654 29.3842 2.10299 29.403 1.20063 29.403C0.993842 29.403 0.787046 29.4218 0.617854 29.2336C0.429863 29.0266 0.354674 28.7819 0.354674 28.5184C0.354674 28.4243 0.373464 28.3302 0.392263 28.2549C0.486258 27.8785 0.730646 27.6715 1.14423 27.6715C1.83979 27.6527 2.55416 27.6527 3.24972 27.6527C3.36252 27.6527 3.49412 27.6715 3.64451 27.615ZM6.08839 29.3842C6.23878 29.7606 6.42677 30.0994 6.63356 30.4381C7.42312 31.7744 8.47586 32.866 9.7354 33.7506C10.9573 34.6163 12.3109 35.1998 13.7772 35.5574C14.5292 35.7456 15.2811 35.8397 16.0707 35.8397C20.4321 35.8208 24.7747 35.8397 29.136 35.8397C29.6436 35.8397 30.1324 35.7644 30.6212 35.6703C31.8807 35.4068 33.065 34.9739 34.1742 34.334C34.8134 33.9764 35.4149 33.5435 35.9789 33.073C36.6933 32.4708 37.3136 31.7744 37.84 31.0027C38.1596 30.5322 38.4604 30.0429 38.686 29.5159C38.7048 29.4594 38.7612 29.4218 38.7048 29.3465C38.6108 29.3089 38.5168 29.3089 38.4416 29.3089C38.0656 29.3089 37.6896 29.2901 37.3136 29.3089C37.0504 29.3089 36.8625 29.1771 36.7497 28.9701C36.6181 28.7443 36.5993 28.5184 36.6369 28.2549C36.7121 27.8032 36.9752 27.5586 37.4452 27.5586C38.028 27.5586 38.6108 27.5774 39.2123 27.5962C39.4191 27.5962 39.4191 27.5962 39.4755 27.408C39.6259 26.881 39.7011 26.3352 39.7763 25.7706C39.7763 25.7141 39.7951 25.6577 39.7575 25.6012C39.6635 25.6012 39.6071 25.6389 39.5131 25.6577C38.78 25.9212 38.028 26.1847 37.2948 26.4481C36.5805 26.6928 36.1105 26.0341 36.1857 25.5071C36.2233 25.1683 36.4113 24.9425 36.7497 24.8296C37.6896 24.5096 38.6296 24.1708 39.5695 23.8321C39.6635 23.7944 39.7763 23.7756 39.8703 23.7003C39.8703 16.7743 39.8703 9.82949 39.8703 2.88466C39.7387 2.90348 39.6823 2.97876 39.5883 3.03523C37.6896 4.50324 35.8097 5.97125 33.911 7.45808C33.7042 7.60865 33.4974 7.66511 33.253 7.60865C32.3695 7.43926 31.4859 7.26987 30.6212 7.11931C30.0196 7.0252 29.4368 6.94992 28.8353 6.87464C28.3089 6.81818 27.7825 6.72408 27.2561 6.70526C27.1997 6.70526 27.1245 6.68643 27.0494 6.74289C27.0306 6.837 27.0305 6.9311 27.0305 7.0252C27.0305 8.41793 27.0305 9.81067 27.0305 11.2034C27.0305 11.3163 27.0306 11.4292 27.0118 11.561C26.9366 11.9374 26.6358 12.1821 26.241 12.2009C25.8274 12.2197 25.489 11.9939 25.3762 11.6175C25.3386 11.5045 25.3386 11.3916 25.3386 11.2599C25.3386 9.79184 25.3386 8.32383 25.3386 6.85582C25.3386 6.76172 25.3574 6.64879 25.2822 6.55469C24.6243 6.51705 23.9851 6.47941 23.2895 6.51705C23.2895 6.64879 23.2895 6.74289 23.2895 6.837C23.2895 7.77803 23.2895 8.71907 23.2895 9.6601C23.2895 10.5447 23.2895 11.4292 23.2895 12.3326C23.2895 12.5773 23.2519 12.8032 23.0827 12.9914C22.8572 13.236 22.5752 13.2925 22.2556 13.2737C21.9172 13.236 21.6352 12.9914 21.56 12.6714C21.5224 12.5397 21.5224 12.4079 21.5224 12.2762C21.5224 10.4694 21.5224 8.66261 21.5224 6.87464C21.5224 6.76172 21.5412 6.66761 21.5036 6.55469C21.1464 6.49823 19.7177 6.53587 19.5109 6.62998C19.4733 6.72408 19.4921 6.837 19.4921 6.9311C19.4921 8.38029 19.4921 9.82949 19.4921 11.2787C19.4921 11.4104 19.4921 11.5233 19.4545 11.6551C19.3417 12.0315 19.0033 12.2574 18.5898 12.2197C18.2138 12.2009 17.913 11.9374 17.8378 11.561C17.819 11.4481 17.819 11.3351 17.819 11.2034C17.819 9.81067 17.819 8.41793 17.819 7.0252C17.819 6.9311 17.8378 6.81818 17.7814 6.74289C17.725 6.70525 17.6686 6.72408 17.6122 6.72408C17.2362 6.7429 16.8791 6.78054 16.5219 6.81818C15.7887 6.91229 15.0555 6.98757 14.3412 7.10049C13.42 7.25106 12.4989 7.40162 11.5777 7.60865C11.3521 7.64629 11.1641 7.60865 10.9949 7.47691C10.4498 7.04403 9.90459 6.61115 9.35942 6.1971C8.00589 5.14314 6.65236 4.08918 5.29883 3.03523C5.22363 2.97876 5.14843 2.88466 5.03563 2.90348C5.03563 9.82949 5.03563 16.7555 5.03563 23.6815C5.33642 23.7944 5.63721 23.8885 5.91919 24.0015C6.70875 24.2838 7.51712 24.5661 8.30668 24.8484C8.56986 24.9425 8.75785 25.1119 8.83305 25.3754C8.92704 25.733 8.83305 26.0341 8.56986 26.2976C8.30667 26.5422 8.00589 26.5611 7.68631 26.4481C6.91555 26.1658 6.14478 25.9023 5.37402 25.6389C5.29882 25.6012 5.20482 25.5636 5.09203 25.5824C5.16723 26.2788 5.26122 26.9563 5.46801 27.5962C5.58081 27.6338 5.6748 27.6338 5.75 27.6338C6.38917 27.615 7.02834 27.615 7.6675 27.5962C7.94949 27.5962 8.13748 27.7279 8.26908 27.9726C8.40067 28.2173 8.41947 28.462 8.36307 28.7254C8.28788 29.1207 8.04348 29.3277 7.6299 29.3465C7.21632 29.3465 6.78396 29.3465 6.37038 29.3653C6.27638 29.3277 6.18238 29.3089 6.08839 29.3842Z"
            fill="black"/>
        <path
            d="M13.439 20.7646C14.8301 20.7646 15.9205 21.8751 15.9205 23.2678C15.9205 24.6417 14.7925 25.7521 13.4202 25.7521C12.0479 25.7521 10.9575 24.6417 10.9575 23.2678C10.9575 21.8562 12.0479 20.7646 13.439 20.7646Z"
            fill="black"/>
        <path
            d="M31.3543 25.7709C29.9819 25.7897 28.854 24.6981 28.8352 23.3054C28.8164 21.9503 29.9255 20.8211 31.2791 20.7834C32.6514 20.7646 33.7982 21.8562 33.817 23.2301C33.817 24.6605 32.7266 25.7521 31.3543 25.7709Z"
            fill="black"/>
        <path
            d="M22.4625 24.8672C23.0265 24.8672 23.6092 24.8672 24.1732 24.8672C24.3236 24.8672 24.4552 24.886 24.5868 24.9613C24.8876 25.1119 24.9816 25.5259 24.756 25.7706C24.0792 26.5422 23.4213 27.3327 22.7445 28.1232C22.5565 28.349 22.4249 28.349 22.2369 28.1232C21.579 27.3515 20.921 26.5799 20.2442 25.8271C20.075 25.6388 20.0186 25.4318 20.1314 25.206C20.2442 24.9801 20.4322 24.886 20.6766 24.886C21.2782 24.8672 21.8609 24.8672 22.4625 24.8672Z"
            fill="black"
        />
    </svg>;
}

function DefaultNavbar(props: DefaultNavbarParams) {
    return <nav className="grid-cols-12 grid text-[1.65rem] md:h-[5.5rem] w-full content-center mx-auto rounded-b-lg md:rounded-b-2xl flex
                     justify-between align-middle bg-white bg-opacity-[36%] md:px-8 max-w-[1280px]">

        <div className="hidden md:flex col-start-1 col-end-13 justify-between">


            <Link href="/">
                <a className="flex h-14 my-auto w-14">
                    <Minicat/>
                </a>
            </Link>


            <Link href="/about">
                <a className="underlining my-auto"><h3>О нас</h3></a>
            </Link>

            <Link href="/materials">
                <a className="underlining my-auto"><h3>Материалы</h3></a>
            </Link>

            <Link href="/tutors">
                <a className="underlining my-auto"><h3>Преподаватели</h3></a>
            </Link>
            <div className="mt-2">
                <AuthSection {...props}/>
            </div>
        </div>

        <div className="col-start-1 col-end-13 md:hidden"><MobileNavbar onClick={props.toggleDrawer}/></div>

    </nav>;
}

function AuthSection(props: DefaultNavbarParams) {
    const router = useRouter()
    const {data: session, status} = useSession()
    useEffect(() => {
        if (session?.user && session.user.name === null) {
            router.push('/users/new')
        }
    }, [status])

    // export async function getInitialProps(context: any) {
    //     const session = await getSession(context)
    //     console.log(session)
    //     if (session?.user === null) {
    //         return {
    //             redirect: {
    //                 destination: '/users/new',
    //                 permanent: false,
    //             },
    //         }
    //     }
    //
    //     return {
    //         props: { session }
    //     }
    // }

    if (status === "loading") {
        return (
            <div
                className={style.authText}>
                <h3>Загрузка...</h3>
            </div>
        )
    } else if (status === "unauthenticated" || !session) {
        return (
            <button onClick={props.handleClickOpenWarning}
                    className={style.authText}>
                <h3>Войти</h3>
            </button>
        )
    } else if (router.pathname === '/users/new') {
        return (
            <button className={style.authText}
                    onClick={() => {
                        signOut({redirect: false}).then(() => router.push("/"))
                    }}>
                <h3>Выход</h3>
            </button>
        )
    } else {
        return (
            <button
                className={style.authText}>
                <h3>{session.user?.name}</h3>
            </button>
        )
    }
}

function MobileNavbar(props: { onClick: () => void, home?: boolean }) {
    return <div className="md:hidden w-full">
        <div className={"flex justify-between h-12 pl-5 pr-5 " + (props.home ? "mt-2" : "")}>
            {/* @ts-ignore */}
            <button className="h-full" onClick={props.onClick()}>
                <Image className="flex" src={burger}/>
            </button>
            <Link href="/">
                <a className="flex h-full w-11">
                    <Image src={MiniCat} alt="mini cat"
                           className="flex"
                        // layout="responsive"
                    />

                </a>
            </Link>
        </div>
    </div>;
}

function HomeNavbar(props: DefaultNavbarParams) {

    return (
        <nav>
            <div
                className="mb-0 hidden md:grid grid-cols-12  2xl:text-4xl xl:text-3xl lg:text-3xl md:text-2xl py-20">
                <div className="col-start-2 col-end-12 flex flex-wrap
                     justify-between items-center grid-cols-12 grid w-full">
                    <div className="flex col-start-1 col-end-10 justify-between">
                        <Link href="/about">
                            <a className="underlining"><h3>О нас</h3></a>
                        </Link>
                        <Link href="/materials">
                            <a className="underlining"><h3>Материалы</h3></a>
                        </Link>

                        <Link href="/tutors">
                            <a className="underlining"><h3>Преподаватели</h3></a>
                        </Link>
                    </div>
                    <AuthSection {...props}/>

                </div>
            </div>
            <MobileNavbar onClick={props.toggleDrawer} home={true}/>

        </nav>);
}

interface NavParams {
    home: boolean;
    handleClickOpenWarning: () => void;
    toggleDrawer: () => void;
}

function Nav({home, handleClickOpenWarning, toggleDrawer}: NavParams) {
    if (home)
        return (
            <HomeNavbar {...{handleClickOpenWarning, toggleDrawer}}/>);
    else
        return (
            <DefaultNavbar {...{handleClickOpenWarning, toggleDrawer}}/>);
}


function ItemsList(props: { onClick: (event: (React.KeyboardEvent | React.MouseEvent)) => void }) {
    return <Box
        sx={{width: 300}}
        role="presentation"
        onClick={props.onClick}
        onKeyDown={props.onClick}
    >
        <List>
            <ListItemButton>
                <Image src={NewsIcon} className="w-6 mr-2"/>
                <Link href="/about"><a>О нас</a></Link>
            </ListItemButton>
            <ListItemButton>
                <Image src={MaterialsIcon} className="w-4 ml-1 mr-3"/>
                <Link href="/materials"><a>Материалы</a></Link>
            </ListItemButton>
            <ListItemButton>
                <Image src={TutorsIcon} className="w-6 mr-2"/>
                <Link href="/tutors"><a>Преподаватели</a></Link>
            </ListItemButton>
        </List>
        <Divider/>
    </Box>;
}


function Navbar() {
    const [state, setState] = React.useState({
        opened: false,
        warning: false
    });
    const router = useRouter();

    const home: boolean = router.pathname === '/';

    const handleClickOpenWarning = () => {
        setState({...state, warning: true});
    };
    const handleCloseWarning = () => {
        setState({...state, warning: false});
    };

    const toggleDrawer =
        () =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event &&
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState({...state, opened: !state.opened});
            };

    return (
        <header className="font-medium justify-center items-center grid grid-cols-1">
            <Nav {...{home, handleClickOpenWarning, toggleDrawer}}/>
            <WarningDialog handleClose={handleCloseWarning} opened={state.warning}/>
            <SwappableDrawer
                className={'md:hidden'}
                anchor={'left'}
                open={state.opened}
                onClose={toggleDrawer()}
                onOpen={toggleDrawer()}
                disableBackdropTransition={false}
                // disableDiscovery={true}
            >
                <ItemsList onClick={toggleDrawer()}/>
            </SwappableDrawer>


        </header>
    );
}

export default Navbar;
