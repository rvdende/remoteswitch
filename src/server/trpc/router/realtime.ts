import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'events';

// create a global event emitter (could be replaced by redis, etc)
export const ee = new EventEmitter();

export const realtimeRouter = router({
    //   hello: publicProcedure
    //     .input(z.object({ text: z.string().nullish() }).nullish())
    //     .query(({ input }) => {
    //       return {
    //         greeting: `Hello ${input?.text ?? "world"}`,
    //       };
    //     }),
    //   getAll: publicProcedure.query(({ ctx }) => {
    //     return ctx.prisma.example.findMany();
    //   }),

    onAdd: publicProcedure.subscription(() => {
        // `resolve()` is triggered for each client when they start subscribing `onAdd`
        // return an `observable` with a callback which is triggered immediately
        return observable<Post>((emit) => {
            const onAdd = (data: Post) => {
                // emit data to client
                emit.next(data);
            };
            // trigger `onAdd()` when `add` is triggered in our event emitter
            ee.on('add', onAdd);
            // unsubscribe function when client disconnects or stops subscribing
            return () => {
                ee.off('add', onAdd);
            };
        });
    }),


    add: publicProcedure
        .input(
            z.object({
                id: z.string().uuid().optional(),
                text: z.string().min(1),
            }),
        )
        .mutation(async ({ input }) => {
            const post = { ...input }; /* [..] add to db */
            ee.emit('add', post);
            return post;
        }),

});


interface Post {
    id?: string
    text: string
}