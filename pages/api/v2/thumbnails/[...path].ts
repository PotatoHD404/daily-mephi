import {NextApiRequest, NextApiResponse} from "next";
import {UUID_REGEX} from "lib/constants/uuidRegex";
import MaterialsThumbnail from "lib/thumbnails/materials";
import UsersThumbnail from "lib/thumbnails/users";
import TutorsThumbnail from "lib/thumbnails/tutors";
import QuotesThumbnail from "lib/thumbnails/quotes";
import ReviewsThumbnail from "lib/thumbnails/reviews";


const thumbnailsMap = {
    materials: MaterialsThumbnail,
    users: UsersThumbnail,
    tutors: TutorsThumbnail,
    quotes: QuotesThumbnail,
    reviews: ReviewsThumbnail,
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }
    // The array of path segments
    const path = req.query.path;

    // check if path is string[]
    if (!Array.isArray(path)) {
        res.status(400).end('Invalid input');
        return;
    }

    if (path.length != 2 || !(path[0] in thumbnailsMap)) {
        res.status(400).end('Invalid input');
        return;
    }

    let [type, id] = path as [keyof typeof thumbnailsMap, string];

    // remove .png at the end if it exists
    if (id.endsWith('.png')) {
        id = id.slice(0, -4);
    }

    // check if is uuid
    if (!id.match(UUID_REGEX)) {
        res.status(400).end('Invalid input');
        return;
    }

    thumbnailsMap[type](id, res);
}