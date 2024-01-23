import {ProvidersProps} from "./getProviders";

export const providerProps: ProvidersProps =
        [{
            id: "home",
            name: "Home MEPHi",
            type: "oauth",
            signinUrl: "http://localhost:3000/api/auth/signin/home",
            callbackUrl: "http://localhost:3000/api/auth/callback/home",
            style: {logo: "/mephi.png", bg: "#E8E9EB", text: "#000000"}
        }, {
            id: "yandex",
            name: "Yandex",
            type: "oauth",
            signinUrl: "http://localhost:3000/api/auth/signin/yandex",
            callbackUrl: "http://localhost:3000/api/auth/callback/yandex",
            style: {logo: "/yandex.svg", bg: "#FFCC00", text: "#000000"}
        }, {
            id: "vk",
            name: "VK",
            type: "oauth",
            signinUrl: "http://localhost:3000/api/auth/signin/vk",
            callbackUrl: "http://localhost:3000/api/auth/callback/vk",
            style: {logo: "/vk.svg", bg: "#07F", text: "#FFFFFF"}
        }, {
            id: "google",
            name: "Google",
            type: "oauth",
            signinUrl: "http://localhost:3000/api/auth/signin/google",
            callbackUrl: "http://localhost:3000/api/auth/callback/google",
            style: {logo: "/google.svg", bg: "#FFFFFF", text: "#000000"}
        }, {
            id: "github",
            name: "GitHub",
            type: "oauth",
            signinUrl: "http://localhost:3000/api/auth/signin/github",
            callbackUrl: "http://localhost:3000/api/auth/callback/github",
            style: {logo: "/github.svg", bg: "#24292F", text: "#FFFFFF"}
        }]