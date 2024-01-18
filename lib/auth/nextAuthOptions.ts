import HomeMEPhiOauth from "./mephiOauthConfig";
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import {User} from "@prisma/client"
// import {Session, User} from "next-auth";
import type {NextAuthOptions} from "next-auth"
import {prisma} from "lib/database/prisma";


// const host = getHost() + "/api/auth/callback/home";
//
// const query = new URLSearchParams({service: host});
// get user type from prisma

// model User {
//   id             String    @id @default(dbgenerated("gen_random_uuid()")) @map("id") @db.Uuid
//   nickname       String?   @unique @map("nickname") @db.String(50)
//   imageId        String?   @unique @map("image_id") @db.Uuid
//   role           String    @default("default") @map("role")
//   email          String?   @unique @map("email")
//   emailVerified  DateTime? @map("email_verified")
//   createdAt      DateTime  @default(now()) @map("created_at")
//   updatedAt      DateTime  @updatedAt @map("updated_at")
//   deletedAt      DateTime? @map("deleted_at")
//   rating         Float     @default(0) @map("rating") @db.Float8
//   bio            String?   @map("bio") @db.String(150)
//   image          File?     @relation(fields: [imageId], references: [id], name: "users_images")
//   place          Int       @default(sequence(start: 1)) @map("place")
//   likesCount     Int       @default(0) @map("likes_count")
//   dislikesCount  Int       @default(0) @map("dislikes_count")
//   commentsCount  Int       @default(0) @map("comments_count")
//   materialsCount Int       @default(0) @map("materials_count")
//   reviewsCount   Int       @default(0) @map("reviews_count")
//   quotesCount    Int       @default(0) @map("quotes_count")
//   documentId     String?   @map("document_id") @db.Uuid
//
//   accounts  Account[]  @relation(name: "users_accounts")
//   sessions  Session[]  @relation(name: "users_sessions")
//   comments  Comment[]  @relation(name: "users_comments")
//   reviews   Review[]   @relation(name: "users_reviews")
//   rates     Rate[]     @relation(name: "users_rates")
//   reactions Reaction[] @relation(name: "users_reactions")
//   files     File[]     @relation(name: "users_files")
//   materials Material[] @relation(name: "users_materials")
//   quotes    Quote[]    @relation(name: "users_quotes")
//   score     Float      @default(0) @map("score")
//   document  Document?  @relation(fields: [documentId], references: [recordId])
//
//   @@index([rating(sort: Desc)])
//   @@map("users")
// }

// select user along with it's image
const selectUser = {
    select: {
        id: true,
        nickname: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        rating: true,
        bio: true,
        place: true,
        likesCount: true,
        dislikesCount: true,
        commentsCount: true,
        materialsCount: true,
        reviewsCount: true,
        quotesCount: true,
        score: true,
        image: {
            select: {
                id: true,
                url: true,
            }
        }
    },
}

let findUser = (id: string) => prisma.user.findUniqueOrThrow({ where: { id }, ...selectUser })
let prismaAdapter = PrismaAdapter(prisma);
prismaAdapter = {
    ...prismaAdapter,
    createUser: (data: any): any => prisma.user.create({ data, ...selectUser },),
    getUser: (id: any): any  => prisma.user.findUnique({ where: { id }, ...selectUser }),
    getUserByEmail: (email: any): any  => prisma.user.findUnique({ where: { email }, ...selectUser  }),
    async getUserByAccount(provider_providerAccountId: any): Promise<any> {
        const account = await prisma.account.findUnique({
            where: { provider_providerAccountId },
            select: {user: selectUser},
        })
        return account?.user ?? null
    },
}

export type MyAppUser = Awaited<ReturnType<typeof findUser>>

export const nextAuthOptions: NextAuthOptions = {
    // https://next-auth.js.org/providers/overview
    adapter: prismaAdapter,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days

        updateAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        HomeMEPhiOauth(),
    ],
    callbacks: {
        async jwt({token, user, account, profile, trigger}) {
            // trigger === "signUp"
            // console.log(token)
            // console.log(token)
            // console.log(profile)
            if (user || profile) {
                token.user = user as MyAppUser;
                // @ts-ignore
                // token.user.role = profile?.role;
                // token.id = user?.id ?? profile?.id;
                // token.role = user?.role ?? profile?.role;
            }
            // token.nickname = token.name;
            // delete token.name;
            return token;
        },
        async session({session, token, user}) {
            // console.log(session)
            // console.log(token)
            if (token.user) {
                // Ensure the session user is of type MyAppUser
                // console.log(token.user)
                // @ts-ignore
                session.user = token.user as MyAppUser;
            }
            return session;
        }
    },
    // pages: {
    // signIn: 'https://login.mephi.ru/login?' + query,
    //     // signOut: '/auth/signout',
    //     // error: '/500', // Error code passed in query string as ?error=
    //     // verifyRequest: '/auth/verify-request', // (used for check email message)
    //     // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    // }
};
