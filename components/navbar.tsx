/*  ./components/Navbar.jsx     */
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
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
import WarningDialog from 'components/warningDialog';
import {useRouter} from "next/router";
import Image from "next/future/image";
import burger from 'images/burger.svg'
import {getSession, signOut, useSession} from "next-auth/react";
import {Session} from "next-auth";
import MiniCat from "images/minicat.svg";
import style from "styles/navbar.module.css";
import {inspect} from "util";
import {ListItemButton} from "@mui/material";
import RegisterDialog from "./registerDialog";


interface DefaultNavbarParams {
    handleClickOpenWarning: () => void;
    toggleDrawer: () => void;
}

function Minicat() {
    return (
        <svg width="64" height="64" viewBox="0 0 435 363" fill="none" xmlns="http://www.w3.org/2000/svg"
             className="group">
            <g filter="url(#filter0_d_909_11)">
                <path fillRule="evenodd" clipRule="evenodd"
                      className="ease-in-out duration-300 group-hover:fill-white fill-transparent"
                      d="M325.6 73.7162L385.532 27.583L385.532 88.3535H385.533V240.603H385.511C385.012 266.085 375.575 289.338 360.256 307.257C341.107 331.232 311.69 346.582 278.701 346.582C277.037 346.582 275.386 346.543 273.746 346.466H159.792C157.879 346.584 155.957 346.643 154.025 346.643C148.589 346.643 143.271 346.185 138.095 345.311C85.6945 338.267 47.4655 288.271 48.4249 237.227C48.4526 235.751 48.5182 234.278 48.6208 232.809V101.037L48.6211 101.037L48.621 27.5831L107.458 73.4352L107.473 73.4285L108.539 73.855L109.819 74.0682H110.885L112.378 73.7445L127.517 70.7592L135.194 69.5903L135.156 69.634C158.738 65.2951 187.052 62.7667 217.503 62.7667C253.458 62.7667 286.435 66.2919 312.161 72.1605L312.179 72.1483L322.376 74.1113L322.873 74.1372L325.279 73.8231L325.6 73.7162Z"
                      fill="white"/>
            </g>
            <path fillRule="evenodd" clipRule="evenodd"

                  d="M33.2919 256.899C33.7765 260.29 34.2611 263.682 35.2303 267.073C34.0581 267.513 33.0041 267.48 32.0682 267.45C31.8433 267.443 31.6252 267.436 31.414 267.436H31.4106C24.6879 267.436 17.7835 267.436 11.0608 267.618C7.06291 267.618 4.7005 269.616 3.79188 273.25C3.61015 273.977 3.42852 274.885 3.42852 275.794C3.42852 278.337 4.15535 280.699 5.97259 282.697C7.47167 284.363 9.27614 284.349 11.106 284.335C11.2726 284.334 11.4394 284.333 11.6061 284.333C20.153 284.333 28.5254 284.158 37.0652 283.98L37.5927 283.969C37.7702 283.969 37.9547 283.962 38.1434 283.955C38.9205 283.926 39.7691 283.894 40.5002 284.333C40.8637 284.696 41.0454 285.241 41.2272 285.786C43.0444 290.146 45.0433 294.325 47.224 298.322C51.9489 306.861 57.5823 314.673 64.1244 321.94C72.8471 331.569 82.842 339.563 94.1089 345.922C105.376 352.281 117.37 357.004 129.909 359.911C138.45 361.91 147.172 363 156.077 363C197.147 362.818 238.398 362.818 279.468 363C285.828 363 292.007 362.455 298.185 361.183C311.633 358.458 324.354 353.916 336.529 347.557C347.796 341.562 357.973 334.113 366.877 325.029C378.326 313.583 387.049 300.139 393.046 285.059C393.088 284.973 393.121 284.878 393.156 284.776C393.268 284.449 393.399 284.065 393.954 283.788H397.77L425.029 284.333C426.483 284.333 427.936 284.151 429.027 283.061C431.571 280.699 432.48 276.157 431.208 272.523C429.936 268.89 427.936 267.8 423.575 267.618H419.396C416.488 267.618 413.626 267.573 410.764 267.527C407.901 267.482 405.039 267.436 402.132 267.436C401.041 267.436 399.769 267.436 398.679 266.891C400.314 258.534 401.587 249.995 402.132 241.638C402.826 240.944 403.627 240.674 404.371 240.423C404.601 240.346 404.825 240.27 405.039 240.185C409.128 238.731 413.262 237.278 417.396 235.824C421.531 234.371 425.665 232.917 429.754 231.464C434.297 229.829 436.296 224.56 434.115 220.2C432.116 216.203 428.3 214.568 423.939 216.021C420.758 217.111 417.578 218.247 414.398 219.382C411.218 220.518 408.038 221.653 404.858 222.743C404.793 222.776 404.727 222.809 404.659 222.844C403.969 223.196 403.141 223.619 402.313 223.288C402.04 222.331 402.075 221.477 402.109 220.648C402.121 220.376 402.132 220.106 402.132 219.836V104.833V8.17975C402.132 5.0912 401.223 2.72934 398.497 1.2759C395.59 -0.177536 392.864 0.549193 390.501 2.36599C389.865 2.91103 389.229 3.41065 388.593 3.91027C387.957 4.4099 387.321 4.90952 386.685 5.45456C365.605 21.9874 344.343 38.7019 323.263 55.4164C321.991 56.3248 320.901 56.8698 319.084 56.5065C316.297 56.022 313.511 55.4971 310.724 54.9723C305.151 53.9226 299.579 52.8729 294.006 52.1462C290.553 51.7828 287.1 51.3286 283.647 50.8744C280.195 50.4202 276.742 49.966 273.289 49.6027C268.383 49.0576 263.658 48.6942 258.933 48.3309C257.625 48.2219 256.316 48.1056 255.008 47.9894C249.774 47.5243 244.54 47.0592 239.307 47.0592C236.399 47.0592 233.492 47.0591 230.584 46.8775C214.41 46.3324 198.237 46.6958 182.245 47.7859C172.25 48.3309 162.256 49.0576 152.261 50.5111C149.358 50.9791 146.407 51.3507 143.433 51.7252C140.635 52.0776 137.816 52.4325 134.997 52.8729C128.091 53.9629 121.368 55.2347 114.644 56.5065C112.826 57.0515 111.554 56.5065 110.101 55.4164C99.1972 46.7867 88.2483 38.1569 77.2995 29.5272C66.3506 20.8974 55.4017 12.2676 44.4982 3.63777C44.2622 3.44907 44.0263 3.24813 43.7872 3.04448C43.1055 2.4638 42.3979 1.86111 41.5906 1.45759C36.8658 -1.2676 31.2323 2.18433 31.414 7.27136V8.90646V218.746V220.926C31.414 221.031 31.4207 221.143 31.4277 221.259C31.457 221.745 31.4907 222.303 31.0505 222.743C30.4448 222.743 30.0006 222.582 29.5564 222.42C29.3343 222.339 29.1122 222.259 28.8699 222.198C25.9623 221.199 23.0547 220.154 20.1471 219.11C17.2395 218.065 14.3319 217.02 11.4243 216.021C10.1522 215.476 8.88016 215.113 7.42636 215.294C3.9736 215.658 0.702563 218.746 0.15739 222.198C-0.569508 226.558 1.24776 230.01 5.06397 231.464C5.33655 231.555 5.5637 231.645 5.79085 231.736C6.018 231.827 6.24515 231.918 6.51774 232.009L6.52018 232.01C14.1518 234.735 21.7834 237.46 29.5968 240.185C31.0505 240.73 31.5958 241.275 31.5958 242.91L31.6118 243.166C31.7885 245.998 31.9752 248.99 32.5044 251.812C32.8073 253.508 33.0496 255.203 33.2919 256.899ZM64.1244 294.325C62.1254 291.055 60.3082 287.784 58.8544 284.151C58.8628 284.144 58.8712 284.138 58.8795 284.131L62.7796 283.92C66.4074 283.788 70.1531 283.788 73.7517 283.788H73.7557C77.7537 283.606 80.1161 281.607 80.843 277.792C81.3882 275.249 81.2065 272.887 79.9344 270.525C78.6623 268.163 76.8451 266.891 74.1192 266.891C71.0299 266.982 67.9406 267.028 64.8513 267.073C61.7619 267.118 58.6726 267.164 55.5833 267.255C54.8564 267.255 53.9478 267.255 52.8574 266.891C50.8585 260.714 49.9499 254.174 49.223 247.452C50.3133 247.27 51.2219 247.633 51.9488 247.997L51.9564 247.999C59.4046 250.542 66.8528 253.085 74.301 255.809C77.3903 256.899 80.2978 256.717 82.842 254.355C85.3861 251.812 86.2948 248.905 85.3861 245.453C84.6592 242.91 82.842 241.275 80.2979 240.366C76.4817 239.004 72.62 237.641 68.7584 236.278C64.8967 234.916 61.0351 233.553 57.2189 232.191C55.6538 231.565 54.0288 230.999 52.3783 230.424C51.1541 229.997 49.916 229.566 48.6778 229.102V28.5278C49.5435 28.3836 50.1801 28.9265 50.7695 29.4291C50.9224 29.5596 51.0722 29.6873 51.222 29.7996L90.4744 60.3217C95.7443 64.3186 101.014 68.4971 106.284 72.6757L106.284 72.676C107.92 73.9477 109.737 74.3111 111.918 73.9477C120.822 71.9493 129.726 70.496 138.63 69.0426L138.631 69.0424C143.323 68.3017 148.1 67.7288 152.902 67.1526C155.168 66.8809 157.44 66.6084 159.711 66.3172L159.712 66.3172C163.164 65.9538 166.617 65.5905 170.251 65.4088C170.388 65.4088 170.524 65.3974 170.66 65.3861C171.069 65.352 171.478 65.3179 171.887 65.5904C172.325 66.1741 172.294 66.9921 172.265 67.7621C172.257 67.9509 172.25 68.1368 172.25 68.3156V108.648C172.25 109.92 172.25 111.01 172.432 112.1C173.159 115.734 176.067 118.277 179.701 118.459C183.699 118.823 186.97 116.642 188.06 113.009C188.424 111.737 188.424 110.647 188.424 109.375V67.4072C188.424 67.1855 188.413 66.953 188.402 66.7149C188.368 65.9775 188.331 65.1871 188.606 64.5004C190.605 63.592 204.416 63.2286 207.868 63.7736C208.139 64.5852 208.107 65.2961 208.074 66.0563C208.062 66.3171 208.05 66.5837 208.05 66.8622V119.004C208.05 120.276 208.05 121.548 208.414 122.819C209.14 125.908 211.866 128.27 215.137 128.633C218.227 128.815 220.952 128.27 223.133 125.908C224.769 124.091 225.132 121.911 225.132 119.549V93.7508V66.4988V63.4103C231.765 63.0518 237.868 63.4006 244.138 63.7589L244.395 63.7736C245.003 64.5339 244.975 65.4213 244.95 66.223C244.945 66.3793 244.94 66.5323 244.94 66.6805V109.194C244.94 110.465 244.94 111.555 245.304 112.645C246.394 116.279 249.665 118.459 253.663 118.277C257.479 118.096 260.387 115.734 261.114 112.1C261.295 110.829 261.295 109.739 261.295 108.65V108.648V68.3156C261.295 67.4072 261.295 66.4988 261.477 65.5904C262.066 65.1491 262.654 65.1843 263.146 65.2136C263.262 65.2205 263.372 65.2271 263.476 65.2271C266.868 65.3482 270.26 65.7923 273.653 66.2364C275.349 66.4585 277.045 66.6805 278.741 66.8622C284.556 67.5889 290.189 68.3156 296.005 69.224C304.364 70.6774 312.904 72.3124 321.445 73.9474L321.446 73.9477C323.809 74.4927 325.807 73.9477 327.806 72.4943C346.161 58.1416 364.333 43.9706 382.687 29.7996C382.954 29.6393 383.19 29.4634 383.422 29.2902C383.979 28.8743 384.515 28.4744 385.413 28.3461V229.284C384.763 229.803 384.021 230.044 383.318 230.272C383.038 230.363 382.764 230.452 382.505 230.555L382.489 230.561C373.409 233.829 364.328 237.098 355.247 240.185C351.976 241.275 350.158 243.455 349.795 246.725C349.068 251.812 353.611 258.171 360.517 255.809C364.06 254.537 367.649 253.265 371.238 251.994C374.827 250.722 378.417 249.45 381.96 248.178C382.309 248.109 382.604 248.012 382.887 247.92C383.341 247.771 383.763 247.633 384.323 247.633C384.595 248.042 384.561 248.451 384.527 248.86C384.516 248.996 384.504 249.132 384.504 249.268C383.777 254.719 383.051 259.987 381.597 265.075C381.052 266.891 381.052 266.891 379.053 266.891L378.532 266.875C372.901 266.699 367.436 266.528 361.97 266.528C357.427 266.528 354.883 268.89 354.156 273.25C353.793 275.794 353.975 277.974 355.247 280.154C356.337 282.152 358.154 283.424 360.698 283.424C363.121 283.303 365.544 283.343 367.967 283.384C369.179 283.404 370.39 283.424 371.602 283.424C372.329 283.424 373.238 283.424 374.146 283.788C374.547 284.322 374.358 284.66 374.158 285.018C374.086 285.147 374.013 285.279 373.964 285.423C371.784 290.51 368.876 295.233 365.787 299.775C360.699 307.224 354.702 313.946 347.796 319.76C342.344 324.302 336.529 328.481 330.35 331.933C319.629 338.11 308.18 342.288 296.005 344.832C291.28 345.74 286.555 346.467 281.648 346.467C267.588 346.467 253.548 346.447 239.515 346.427C211.469 346.386 183.45 346.346 155.35 346.467C147.718 346.467 140.449 345.559 133.18 343.742C119.005 340.29 105.921 334.658 94.1089 326.301C81.9334 317.762 71.7568 307.224 64.1244 294.325Z"
                  fill="black"/>
            <path
                d="M129.988 200.716C143.435 200.716 153.975 211.435 153.975 224.879C153.975 238.142 143.072 248.861 129.806 248.861C116.54 248.861 106 238.142 106 224.879C106 211.253 116.54 200.716 129.988 200.716Z"
                fill="black"/>
            <path
                d="M304.171 249.044C290.905 249.226 280.001 238.688 279.82 225.244C279.638 212.163 290.36 201.262 303.444 200.899C316.71 200.717 327.795 211.255 327.977 224.517C327.977 238.325 317.437 248.862 304.171 249.044Z"
                fill="black"/>
            <path
                d="M216.572 240.749C222.024 240.749 227.657 240.749 233.109 240.749C234.563 240.749 235.835 240.931 237.107 241.657C240.014 243.111 240.923 247.108 238.742 249.47C232.2 256.919 225.84 264.549 219.298 272.18C217.48 274.36 216.208 274.36 214.391 272.18C208.031 264.731 201.67 257.282 195.128 250.015C193.493 248.198 192.948 246.199 194.038 244.019C195.128 241.839 196.946 240.931 199.308 240.931C205.123 240.749 210.757 240.749 216.572 240.749Z"
                fill="black"/>
            <defs>
                <filter id="filter0_d_909_11" x="44.4072" y="27.583" width="345.125" height="327.061"
                        filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                   result="hardAlpha"/>
                    <feOffset dy="4"/>
                    <feGaussianBlur stdDeviation="2"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_909_11"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_909_11" result="shape"/>
                </filter>
            </defs>
        </svg>
    );
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
    // const router = useRouter()
    const {data: session, status} = useSession()
    const [open, setOpen] = useState(false)


    useEffect(() => {
        // console.log("Auth section rerendered")
        if (session?.user && session.user.name === null) {
            // setOpen(true);

            // router.push('/users/new')


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
            <>
                <RegisterDialog
                    handleClose={() => setOpen(false)}
                    opened={open}/>
                <div
                    className={style.authText}>
                    <h3>Загрузка...</h3>
                </div>
            </>
        )
    } else if (status === "unauthenticated" || !session) {
        return (
            <>
                <RegisterDialog
                    handleClose={() => setOpen(false)}
                    opened={open}/>
                <button onClick={props.handleClickOpenWarning}
                        className={style.authText}>
                    <h3>Войти</h3>
                </button>
            </>
        )
    }
        // else if (router.pathname === '/users/new') {
        //     return (
        //         <button className={style.authText}
        //                 onClick={() => {
        //                     signOut({redirect: false}).then(() => router.push("/"))
        //                 }}>
        //             <h3>Выход</h3>
        //         </button>
        //     )
    // }
    else {
        return (
            <>
                <RegisterDialog
                    handleClose={() => setOpen(false)}
                    opened={open}/>
                <button
                    className={style.authText}>
                    <h3>{session.user?.name || "Профиль"}</h3>
                </button>
            </>
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
                className="mb-0 hidden md:grid grid-cols-12  2xl:text-4xl xl:text-3xl lg:text-3xl md:text-2xl py-20
               mr-10">
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
                className='md:hidden'
                anchor='left'
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
