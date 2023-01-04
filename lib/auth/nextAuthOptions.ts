import HomeMEPhiOauth from "./mephiOauthConfig";
import SequelizeAdapter, { models } from "@next-auth/sequelize-adapter"
import { DataTypes } from "sequelize"
import {NextAuthOptions, SessionStrategy} from "next-auth";
import sequelize from "lib/database/sequilize";


// const host = getHost() + "/api/auth/callback/home";
//
// const query = new URLSearchParams({service: host});


export const nextAuthOptions: NextAuthOptions = {
    // https://next-auth.js.org/providers/overview
    adapter: SequelizeAdapter(sequelize, {
        models: {
            User: sequelize.define("users", {
                ...models.User,
                role: DataTypes.STRING,
                rating: DataTypes.FLOAT,
                bio: DataTypes.STRING,
                banned: DataTypes.BOOLEAN,
                banned_reason: DataTypes.STRING,
                banned_until: DataTypes.DATE,
                banned_at: DataTypes.DATE
              }),
            Account: sequelize.define("accounts", {...models.Account}),
            Session: sequelize.define("sessions", {...models.Session}),
            VerificationToken: sequelize.define("verification_tokens", {...models.VerificationToken})
        }
    }),
    session: {
        strategy: "jwt" as SessionStrategy,
        maxAge: 30 * 24 * 60 * 60, // 30 days

        updateAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        HomeMEPhiOauth(),
    ],
    callbacks: {
        async jwt({token, user, account, profile, isNewUser}) {
            if (user || profile) {
                token.id = user?.id ?? profile?.id;
                token.role = user?.role ?? profile?.role;
            }
            return token;
        },
        session: async ({session, token, user}) => {
            // console.log("session");
            // console.log(session)
            // console.log(user)
            // console.log(token)
            if (session.user || token) {
                // @ts-ignore
                session.user.id = user?.id ?? token?.sub;
                // @ts-ignore
                session.user.role = user?.role ?? token?.role;
            }
            // console.log("session1");
            return session;
        }
    },
    // pages: {
    //     // signIn: 'https://login.mephi.ru/login?' + query,
    //     // signOut: '/auth/signout',
    //     // error: '/500', // Error code passed in query string as ?error=
    //     // verifyRequest: '/auth/verify-request', // (used for check email message)
    //     // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    // }
};
