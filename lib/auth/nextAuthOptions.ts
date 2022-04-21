import HomeMEPhiOauth from "./mephiOauthConfig";
import SequelizeAdapter from "@next-auth/sequelize-adapter"
import {Sequelize} from "sequelize";


const sequelize = new Sequelize('postgres://PotatoHD:password@localhost:5432/stocks');

export const nextAuthOptions = {
    // https://next-auth.js.org/providers/overview
    secret: process.env.AUTH_SECRET,
    providers: [
        HomeMEPhiOauth(),
    ],
    pages: {
        signIn: '/',
        // signOut: '/auth/signout',
        error: '/500', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    },

    adapter: SequelizeAdapter(sequelize)

};