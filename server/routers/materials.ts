import {z} from 'zod';
import {t} from 'server/trpc';
import {TRPCError} from "@trpc/server";
import {isAuthorized} from "../middlewares/isAuthorized";
import {verifyCSRFToken} from "../middlewares/verifyCSRFToken";
import {verifyRecaptcha} from "../middlewares/verifyRecaptcha";
import {getDocument} from "../../lib/database/fullTextSearch";



export const materialsRouter = t.router({
    getOne: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/materials/{id}',
            protect: true,
            // TODO: check if auth is needed or not
        }
    })
        .input(z.object({
            id: z.string().uuid(),
        }))
        .output(z.any())
        .use(isAuthorized)
        .query(async ({ctx: {prisma}, input: {id}}) => {
            const material = await prisma.material.findUnique({
                where: {
                    id
                },
                select: {
                    title: true,
                    text: true,
                    createdAt: true,
                    files: {
                        select: {
                            filename: true,
                            url: true,
                        }
                    },
                    tutor: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            fatherName: true,
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            nickname: true,
                        }
                    },
                    faculties: {
                        select: {
                            name: true,
                        }
                    },
                    disciplines: {
                        select: {
                            name: true,
                        }
                    },
                    semesters: {
                        select: {
                            name: true,
                        }
                    },
                    likesCount: true,
                    dislikesCount: true,
                    commentsCount: true,
                },
            });
            if (!material) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Material not found',
                });
            }
            return material;
        }),
    getAll: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/materials',
            protect: true,
            // TODO: check if auth is needed or not
        }
    })
        .input(z.void())
        .output(z.any())
        .use(isAuthorized)
        .query(async ({ctx: {prisma}}) => {
            return await prisma.material.findMany({
                select: {
                    id: true,
                    title: true,
                    text: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            nickname: true,
                            image: true,
                        }
                    },
                    likesCount: true,
                    dislikesCount: true,
                    commentsCount: true,
                },
                take: 10
                // take: req.query.take ? parseInt(req.query.take) : undefined,
            });
        }),
    add: t.procedure.meta({
        openapi: {
            method: 'POST',
            path: '/materials',
            protect: true,
        }
    })
        .input(z.object({
            title: z.string(),
            text: z.string(),
            files: z.array(z.string()),
            tutorId: z.string().uuid(),
            facultyIds: z.array(z.string().uuid()),
            disciplineIds: z.array(z.string().uuid()),
            semesterIds: z.array(z.string().uuid()),
            csrfToken: z.string(),
            recaptchaToken: z.string(),
        }))
        .output(z.any())
        .use(isAuthorized)
        .use(verifyCSRFToken)
        .use(verifyRecaptcha)
        .mutation(async ({ctx: {prisma, user}, input: {title, text, files, tutorId, facultyIds, disciplineIds, semesterIds}}) => {
            return await prisma.$transaction(async (prisma) => {
                const material = await prisma.material.create({
                        data: {
                            title,
                            text,
                            files: files.length > 0 ? {
                                connect: files.map(file => ({
                                    id: file
                                }))
                            } : undefined,
                            faculties: facultyIds.length > 0 ? {
                                connect: facultyIds.map(faculty => ({
                                    name: faculty
                                }))
                            } : undefined,
                            disciplines: disciplineIds.length > 0 ? {
                                connect: disciplineIds.map(discipline => ({
                                    name: discipline
                                }))
                            } : undefined,
                            semesters: semesterIds.length > 0 ? {
                                connect: semesterIds.map(semester => ({
                                    name: semester
                                }))
                            } : undefined,
                            tutor: {
                                connect: {
                                    id: tutorId
                                }
                            },
                            user: {
                                connect: {
                                    id: user.id
                                }
                            }
                        }
                    }
                );
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        materialsCount: {
                            increment: 1
                        }
                    }
                });
                if (tutorId) {
                    await prisma.tutor.update({
                        where: {
                            id: tutorId
                        },
                        data: {
                            materialsCount: {
                                increment: 1
                            }
                        }
                    });
                }
                return material;
            });
        }),
    getFromTutor: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/tutors/{id}/materials',
        }
    })
        .input(z.object({
            id: z.string().uuid(),
        }))
        .output(z.any())
        .query(async ({ctx: {prisma}, input: {id}}) => {
            return await prisma.material.findMany({
                where: {tutorId: id},
                select: {
                    id: true,
                    title: true,
                    text: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            nickname: true,
                            image: true,
                        }
                    },
                    likesCount: true,
                    dislikesCount: true,
                    commentsCount: true
                },
                take: 10,
                orderBy: {createdAt: 'desc'}
            });
        }),
    addToTutor: t.procedure.meta({
        openapi: {
            method: 'POST',
            path: '/tutors/{id}/materials',
            protect: true
        }
    })
        .input(z.object({
            id: z.string().uuid(),
            title: z.string(),
            text: z.string(),
            fileIds: z.array(z.string().uuid()),
            facultyIds: z.array(z.string().uuid()),
            disciplineIds: z.array(z.string().uuid()),
            semesterIds: z.array(z.string().uuid()),
            csrfToken: z.string(),
            recaptchaToken: z.string()
        }))
        .output(z.any())
        .use(isAuthorized)
        .use(verifyCSRFToken)
        .use(verifyRecaptcha)
        .mutation(async ({
                             ctx: {prisma, user},
                             input: {id: tutorId, title, text, fileIds, facultyIds, disciplineIds, semesterIds}
                         }) => {
            const material = await prisma.$transaction(async (prisma) => {

                const material = await prisma.material.create({
                        data: {
                            title,
                            text,
                            files: fileIds.length > 0 ? {
                                connect: fileIds.map(fileId => ({
                                    id: fileId
                                }))
                            } : undefined,
                            faculties: facultyIds.length > 0 ? {
                                connect: facultyIds.map(facultyId => ({
                                    name: facultyId
                                }))
                            } : undefined,
                            disciplines: disciplineIds.length > 0 ? {
                                connect: disciplineIds.map(disciplineId => ({
                                    name: disciplineId
                                }))
                            } : undefined,
                            semesters: semesterIds.length > 0 ? {
                                connect: semesterIds.map(semesterId => ({
                                    name: semesterId
                                }))
                            } : undefined,
                            tutor: {
                                connect: {
                                    id: tutorId
                                }
                            },
                            user: {
                                connect: {
                                    id: user.id
                                }
                            }
                        }
                    }
                );
                await prisma.tutor.update({
                    where: {
                        id: tutorId
                    },
                    data: {
                        materialsCount: {
                            increment: 1
                        }
                    }
                });
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        materialsCount: {
                            increment: 1
                        }
                    }
                });
                await prisma.document.create({
                    data: {
                        type: "material",
                        text,
                        ...getDocument(title + ' ' + text)
                    }
                });

                return material;
            });
        }),

});
