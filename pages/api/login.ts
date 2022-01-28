// pages/api/login.ts

// import {withIronSessionApiRoute} from "iron-session/next";
// import {NextApiRequest, NextApiResponse} from "next";
import {Octokit} from 'octokit';
// import {sessionOptions} from '../../lib/backend/config';

const octokit: Octokit = new Octokit();
//
// export default withIronSessionApiRoute(async function loginRoute(req: NextApiRequest,
//                                                                  res: NextApiResponse<string>) {
//         // get user from database then:
//         const username: string = 'PotatoHD';
//         const {
//             data: {login, avatar_url},
//         } = await octokit.rest.users.getByUsername({username});
//
//         // req.session.user = {name: "John"};
//         (req.session as any).user = {isLoggedIn: true, login, avatarUrl: avatar_url} as User;
//         await req.session.save();
//         res.send("Logged in");
//     },
//     sessionOptions);
// type User = {
//     isLoggedIn: boolean
//     login: string
//     avatarUrl: string
// }

