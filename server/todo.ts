import { z } from 'zod';
import { t } from 'lib/trpc';

// https://github.com/jlalmes/trpc-openapi

export const todoRouter = t.router({
    test: t.procedure.meta({openapi: { method: 'GET', path: '/test' } }).input(z.void()).output(z.string()).query(() => {
        return "Hello from trpc";
    }),
    // all: t.procedure.query(({ ctx }) => {
    //     return ctx.prisma.task.findMany({
    //         orderBy: {
    //             createdAt: 'asc',
    //         },
    //     });
    // }),
    // add: t.procedure
    //     .input(
    //         z.object({
    //             id: z.string().optional(),
    //             text: z.string().min(1),
    //         }),
    //     )
    //     .mutation(async ({ ctx, input }) => {
    //         const todo = await ctx.task.create({
    //             data: input,
    //         });
    //         return todo;
    //     }),
    // edit: t.procedure
    //     .input(
    //         z.object({
    //             id: z.string().uuid(),
    //             data: z.object({
    //                 completed: z.boolean().optional(),
    //                 text: z.string().min(1).optional(),
    //             }),
    //         }),
    //     )
    //     .mutation(async ({ ctx, input }) => {
    //         const { id, data } = input;
    //         const todo = await ctx.task.update({
    //             where: { id },
    //             data,
    //         });
    //         return todo;
    //     }),
    // delete: t.procedure
    //     .input(z.string().uuid())
    //     .mutation(async ({ ctx, input: id }) => {
    //         await ctx.task.delete({ where: { id } });
    //         return id;
    //     }),
    // clearCompleted: t.procedure.mutation(async ({ ctx }) => {
    //     await ctx.task.deleteMany({ where: { completed: true } });
    //
    //     return ctx.task.findMany();
    // }),
});
