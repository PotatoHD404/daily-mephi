import {faker} from "@faker-js/faker";
import {isAuthorizedFunc} from "./mocks/isAuthorized";
import "./mocks/verifyCSRFToken";
import "./mocks/verifyRecaptcha";
import {trpc} from "./mocks/trpc"; // order matters
import {inferProcedureInput, TRPCError} from "@trpc/server";
import {prisma} from "./utils/prisma";
// import "./utils/notion";
import type {AppRouter} from "server";
import {BinaryLike, createHash} from "crypto";

import axios from "axios";
import {createUsers} from "./utils/createUsers";
import {describe, it, expect, jest} from '@jest/globals';
describe('[GET] /api/v2/files/{id}', () => {
    it('Test get one', async () => {

    });
});

// describe('[POST] /api/v2/files', () => {
//
//
// });
//
// describe('[PUT] /api/v2/files', () => {
//
// });

// This is a sample file for upload. Replace it with your actual file.
const sampleFile = Buffer.from("Hello, World!");

// Function to calculate checksum
function calculateChecksum(data: Buffer | BinaryLike) {
    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}

// Save original checksum for comparison
const originalChecksum = calculateChecksum(sampleFile);

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'mockedToken'),
    verify: jest.fn(() => ({
        signedPutUrl: 'http://example.com/upload',
        block: 'blockId',
        ext: 'txt',
        filename: 'sample',
    })),
}));

// describe('filesRouter', () => {
//     it('uploads, saves and retrieves a file correctly', async () => {
//         const {usersWithImages, users, imageIds} = await createUsers();
//         const currUser = faker.helpers.arrayElement(usersWithImages)
//
//         isAuthorizedFunc.mockImplementation(async ({ctx: {req, res}, next}) => {
//             return next({
//                 ctx: {
//                     user: {
//                         id: currUser.id,
//                         nickname: currUser.nickname,
//                         image: currUser.image ? currUser.image.url : null,
//                     },
//                 },
//             })
//         })
//
//         const params: inferProcedureInput<AppRouter["files"]["getLink"]> = {
//             filename: 'sample.txt',
//             csrfToken: 'csrfToken',
//             recaptchaToken: 'recaptchaToken'
//         }
//
//         // Get upload link
//         const {token, signedGetUrl} = await trpc.files.getLink(params);
//
//
//         // Upload sample file to the upload link
//         await axios.put(signedGetUrl, sampleFile, {headers: {'Content-Type': 'text/plain'}});
//
//         const params1: inferProcedureInput<AppRouter["files"]["putFile"]> = {
//             token: token,
//             csrfToken: 'csrfToken',
//             recaptchaToken: 'recaptchaToken'
//         }
//
//         // Post the link to save it
//         const {url} = await trpc.files.putFile(params1);
//
//         // get block id from db
//         const file = await prisma.file.findFirst({
//             where: {
//                 url: url
//             },
//             select: {
//                 id: true
//             }
//         });
//
//         expect(file).not.toBeNull();
//
//         if (!file) {
//             throw new Error('File not found');
//         }
//
//
//         const params2: inferProcedureInput<AppRouter["files"]["get"]> = {
//             id: file.id
//         }
//
//         // Get the file link
//         const fileData = await trpc.files.get(params2);
//
//         expect(fileData).not.toBeNull();
//
//         if (!fileData) {
//             throw new Error('File not found');
//         }
//
//         expect(fileData.url).toEqual(url);
//
//         // Download the file and verify its checksum
//         const response = await axios.get(url);
//         const downloadedChecksum = calculateChecksum(response.data);
//         expect(downloadedChecksum).toEqual(originalChecksum);
//     });
// });