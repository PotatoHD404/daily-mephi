import {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../../../lib/database/prisma";
import {Prisma} from "@prisma/client";
import stringSimilarity from "string-similarity";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (process.env.LOCAL !== "true") {
        res.status(403).json({status: "not allowed"});
        return;
    }
// Get tutors and calculate nicks
    await prisma.$transaction(async (prisma: Prisma.TransactionClient) => {
        const tutors = await prisma.tutor.findMany({
            select: {
                nickName: true,
                url: true,
                firstName: true,
                lastName: true,
                fatherName: true,
            }
        });

        const letterMap: { [id: string]: string } = {
            "а": "a",
            "б": "b",
            "в": "v",
            "г": "g",
            "д": "d",
            "е": "e",
            "ё": "e",
            "ж": "zh",// ?
            "з": "z",
            "и": "i",
            "й": "j", //? true
            "к": "k",
            "л": "l",
            "м": "m",
            "н": "n",
            "о": "o",
            "п": "p",
            "р": "r",
            "с": "s",
            "т": "t",
            "у": "u",
            "ф": "f",
            "х": "kh", // -
            "ц": "ts", // -
            "ч": "ch", // -
            "ш": "sh", // ?
            "щ": "shch", // -
            "ъ": "", // -
            "ы": "y", // -
            "ь": "", // -
            "э": "e",
            "ю": "yu",
            "я": "ya",
            " ": "",
            "-": "",
        };
        let score = 0
        let count = 0
        let wrong = 0
        const nicknames: string[] = []
        for (const tutor of tutors.filter(el => el.nickName !== null)) {
            let nickName = tutor.firstName ? letterMap[tutor.firstName[0].toLowerCase()][0] : "";
            nickName += tutor.fatherName ? letterMap[tutor.fatherName[0].toLowerCase()][0] : "";
            nickName += tutor.lastName ? Array.from(tutor.lastName.toLowerCase()
                    // .replace(/ый$/, "ы")
                    // .replaceAll("ае", "айе")
                    .replaceAll("ей", "еы")
                    .replaceAll("ой", "ои")
                    .replaceAll("ое", "оые")
                    .replaceAll("ый", "ыи")
                    .replaceAll("ий", "ии")
                    .replaceAll("ье", "ые")
                // .replaceAll("ае", "аые")

            ).map(el => letterMap[el]).join("") : "";
            // console.log(tutor.lastName ? Array.from(tutor.lastName.toLowerCase().split("-")[0]) : "nul(")
            tutor.lastName = tutor.lastName?.replace("й", "й") ?? null
            tutor.firstName = tutor.firstName?.replace("й", "й") ?? null
            tutor.fatherName = tutor.fatherName?.replace("й", "й") ?? null
            // @ts-ignore
            const elScore = stringSimilarity.compareTwoStrings(tutor.nickName
                    .replace(/iy$/, "ii")
                    // .replaceAll("ij", "ii")
                    .replace(/ij$/, "ii")
                    .replace(/y$/, "ii")
                    .replaceAll("aye", "ae")
                    .replaceAll("eye", "ee").toLowerCase()
                    // .replaceAll("ai", "aj")

                // .replaceAll("y", "ii")
                , nickName)
            if (elScore !== 1.0) {
                console.log(tutor)
                console.log(nickName)
                // @ts-ignore
                console.log(elScore)
                wrong++
            }
            nicknames.push(nickName)
            score += elScore
            count++
        }
        for (const tutor of tutors.filter(el => el.nickName !== null)) {
            // @ts-ignore
            const match = stringSimilarity.findBestMatch(tutor.nickName
                .replace(/iy$/, "ii")
                // .replaceAll("ij", "ii")
                .replace(/ij$/, "ii")
                .replace(/y$/, "ii")
                .replaceAll("aye", "ae")
                .replaceAll("eye", "ee").toLowerCase(), nicknames).ratings.sort((a, b) => b.rating - a.rating)[0]
            // @ts-ignore
            if(match.target !== tutor.nickName
                .replace(/iy$/, "ii")
                // .replaceAll("ij", "ii")
                .replace(/ij$/, "ii")
                .replace(/y$/, "ii")
                .replaceAll("aye", "ae")
                .replaceAll("eye", "ee").toLowerCase())
            {
                // console.log(match, tutor.nickName)
            }
            if(tutor.nickName === "evmorozova")
                console.log(match, tutor.nickName)
        }
        console.log(score, count, wrong, score / wrong)
    });

    res.status(200).json({
        status: "ok",
    });
}
