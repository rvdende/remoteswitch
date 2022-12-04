import { protectedProcedure, router } from "@/server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const datasourceRouter = router({
    create: protectedProcedure.input(z.object({
        uuid: z.string()
    })).mutation(async ({ ctx, input }) => {

        // check
        const find = await ctx.prisma.rdatasource.findFirst({
            where: { uuid: input.uuid, },
            include: { user: true }
        })

        if (find && find.userid !== ctx.user.id) throw new TRPCError({
            code: "FORBIDDEN",
            message: `Device with this uuid already added by ${find.user.name}.`
        });

        if (find && find.userid === ctx.user.id) throw new TRPCError({
            code: "FORBIDDEN",
            message: `Device with this uuid already added by you.`
        })


        return ctx.prisma.rdatasource.create({
            data: {
                uuid: input.uuid,
                name: "",
                description: "",
                type: "",
                userid: ctx.user.id
            }
        });
    }),
    findMany: protectedProcedure
        .query(async ({ ctx }) => {
            return ctx.prisma.rdatasource.findMany({
                where: { userid: ctx.user.id }
            })
        })
})