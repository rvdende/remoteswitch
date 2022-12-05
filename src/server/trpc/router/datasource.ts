import { protectedProcedure, router } from "@/server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const datasourceRouter = router({
    addToAccount: protectedProcedure.input(z.object({
        uuid: z.string()
    })).mutation(async ({ ctx, input }) => {

        // check
        const find = await ctx.prisma.rdatasource.findFirst({
            where: { uuid: input.uuid, },
            include: { users: true }
        })

        if (find) {
            // then add us to the users.
            return await ctx.prisma.rdatasource.update({
                where: { uuid: input.uuid },
                data: {
                    users: { connect: { id: ctx.session?.user?.id } }
                }
            })
        }

        // if (find && find.userid !== ctx.user.id) throw new TRPCError({
        //     code: "FORBIDDEN",
        //     message: `Device with this uuid already added by ${find.user[]}.`
        // });

        // if (find && find.userid === ctx.user.id) throw new TRPCError({
        //     code: "FORBIDDEN",
        //     message: `Device with this uuid already added by you.`
        // })


        return new TRPCError({ code: "NOT_FOUND", message: "The device with this uuid was not found." })
    }),
    findMany: protectedProcedure
        .query(async ({ ctx }) => {

            if (ctx.session?.user?.id === undefined) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })

            // const data = await ctx.prisma.rdatasource.findMany({
            //     where: {
            //         users: { id: ctx.session?.user?.id }
            //     },
            //     include: {
            //         users: true
            //     }
            // })

            const data = await ctx.prisma.user.findFirst({
                where: {
                    id: ctx.session.user.id
                },
                select: {
                    datasources: {
                        include: {
                            users: {
                                select: { email: true }
                            }
                        }

                    }
                }
            })


            // da data.findFirst({

            //     where: { id: ctx.session?.user?.id },
            //     include: {
            //         datasources: {
            //             include: { users: true }
            //         }
            //     }
            // })

            return data?.datasources;

            // return ctx.prisma.rdatasource.findMany({
            //     where: { userid: {  } }
            // })
        })
})