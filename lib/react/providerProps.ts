import {ProvidersProps} from "./getProviders";

export const providerProps: ProvidersProps =
        [{
            id: "home",
            name: "Home MEPHi",
            type: "oauth",
            signinUrl: "/api/auth/signin/home",
            callbackUrl: "/api/auth/callback/home",
            style: {logo: "/mephi.svg", bg: "#E8E9EB", text: "#000000"}
        }, {
            id: "yandex",
            name: "Yandex",
            type: "oauth",
            signinUrl: "/api/auth/signin/yandex",
            callbackUrl: "/api/auth/callback/yandex",
            style: {logo: "/yandex.svg", bg: "#FFCC00", text: "#000000"}
        }, {
            id: "vk",
            name: "VK",
            type: "oauth",
            signinUrl: "/api/auth/signin/vk",
            callbackUrl: "/api/auth/callback/vk",
            style: {logo: "/vk.svg", bg: "#07F", text: "#FFFFFF"}
        }, {
            id: "google",
            name: "Google",
            type: "oauth",
            signinUrl: "/api/auth/signin/google",
            callbackUrl: "/api/auth/callback/google",
            style: {logo: "/google.svg", bg: "#FFFFFF", text: "#000000"}
        }, {
            id: "github",
            name: "GitHub",
            type: "oauth",
            signinUrl: "/api/auth/signin/github",
            callbackUrl: "/api/auth/callback/github",
            style: {logo: "/github.svg", bg: "#24292F", text: "#FFFFFF"}
        }]