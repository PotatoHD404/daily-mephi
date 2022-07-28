import { SessionProvider } from "next-auth/react";
import Home from "../../../pages";


export default {
    title: 'Home',
    component: Home
}

export const HomePage = () => <Home />
