import React from "react";
import Link from "next/link";
import GitHub from 'images/github.svg'
import Image from "next/image";
import {useRouter} from "next/router";

// style="background-color: #f1f1f1;"
function Footer() {
    const router = useRouter();

    const home: boolean = router.pathname === '/';
    const home1: boolean = router.pathname === '/' || router.pathname === '/404' || router.pathname === '/500';
    return (
        <footer className="flex justify-center">

            <div className={`text-center grid grid-cols-12 justify-start
                content-start items-start h-24 absolute bottom-0 w-full
                 ${home ? "bg-white md:bg-transparent" : (!home1 ? "max-w-[1280px]" : "md:px-8")}`}>
                <div className={home1 ? "col-start-2 col-end-12" : "col-start-1 col-end-13"}>
                    <div className="grid grid-cols-3 align-bottom">
                        <div className="md:bg-black rounded col-start-1 h-[2px] col-end-13 mb-8"/>
                        <div className={`flex justify-center md:justify-between col-start-1 col-end-13 ${home1 ? "" : "md:px-8"}`}>
                            <div className="text-left pl-1 text-2xl w-fit hidden md:flex">
                                support@daily-mephi.ru
                            </div>

                            <div className="text-center md:text-2xl text-xl h-max-auto">
                                © {new Date().getFullYear()} Daily MEPhi
                            </div>
                            <div
                                className="justify-end gap-3 text-2xl hidden lg:flex">
                                <Link href="https://github.com/MEPhI-Floppas/daily-mephi" passHref>
                                    <div className="w-8 h-8 flex">
                                        <Image
                                            src={GitHub}
                                            alt="GitHub"
                                            className="cursor-pointer"
                                        />
                                    </div>
                                </Link>
                                <Link href="https://github.com/MEPhI-Floppas/daily-mephi" passHref>

                                    <div className="cursor-pointer flex">github.com</div>

                                </Link>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    );

}

export default Footer;
