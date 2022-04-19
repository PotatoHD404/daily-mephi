import {OAuthConfig, OAuthUserConfig} from "next-auth/providers";

export interface DailyProfile extends Record<string, any> {
    id: string
}

export default function DailyOauth<P extends Record<string, any> = DailyProfile>(): OAuthConfig<P> {
    return {
        id: "daily",
        name: "Daily MEPhi",
        type: "oauth",
        idToken: true,
        profile(profile) {
            return {
                id: profile.id
            }
        },
        options: {clientId: '', clientSecret: ''},
    }
}