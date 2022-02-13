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
// <div>© {new Date().getFullYear()} ExtraMine.ru</div>
class Footer extends Component {
    render() {
        return (
            <footer className="text-center text-white grid grid-cols-12 justify-center">
                <div className="bg-black col-start-2 col-end-12 h-1.5 rounded mb-5"/>
                <div className="text-left col-start-2 col-end-5 pl-1 text-gray-700 p-4 font-semibold">
                    <div className="text-2xl">support@daily-mephi.ru</div>
                </div>

                <div className="text-center col-start-6 col-end-8 text-gray-700 p-4 text-2xl font-semibold">
                    © {new Date().getFullYear()} daily mephi
                </div>
                <div
                    className="col-start-9 flex-row justify-end gap-1 col-end-12 text-gray-700 p-4 text-2xl font-semibold">
                    <div className="-mt-0.5">
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
            </footer>
        );
    }
}

export default Footer;
