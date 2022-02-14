import React, {Component} from "react";
import Link from "next/link";
import styles from "../styles/footer.module.css";
import Home from "./../images/home.svg";
import News from "./../images/news.svg";
import Forum from "./../images/forum.svg";
import Shop from "./../images/shop.svg";
import Servers from "./../images/servers.svg";
import Profile from "./../images/profile.svg";
import GitHub from '../images/github.svg'
import Image from "next/image";

// style="background-color: #f1f1f1;"
class Footer extends Component {
    render() {
        return (
            <footer className="text-center grid grid-cols-12 justify-start content-start items-start h-fit">


                <div className="col-start-2 col-end-12 ">
                    <div className="grid grid-cols-3 align-bottom">
                        <div className="bg-black h-1.5 rounded grid col-start-1 col-end-13 mb-8"/>
                        <div className="text-left col-span-1 pl-1 text-2xl ">
                            support@daily-mephi.ru
                        </div>

                        <div className="text-center col-span-1 text-2xl h-max-auto">
                            © {new Date().getFullYear()} Daily MEPhi
                        </div>
                        <div
                            className="col-span-1 flex-row justify-end gap-1 text-2xl">
                            <div>
                                <Link href="https://github.com/MEPhI-Floppas/daily-mephi" passHref>

                                    <Image
                                        src={GitHub}
                                        alt="GitHub"
                                        className="cursor-pointer"
                                    />
                                </Link>
                            </div>
                            <Link href="https://github.com/MEPhI-Floppas/daily-mephi" passHref>

                                <div className="cursor-pointer flex">github.com</div>

                            </Link>

                        </div>
                    </div>
                </div>


            </footer>
        );
    }
}

export default Footer;
