import { protectedProcedure, router } from "@/server/trpc/trpc";
import type { Rdatasource, Rinput, Routput } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import EventEmitter from "events";
import { z } from "zod";

export const realtimeEvents = new EventEmitter();

export const datasourceRouter = router({
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.rdatasource.delete({
        where: { id: input.id },
      });
    }),
  addToAccount: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // check
      const find = await ctx.prisma.rdatasource.findFirst({
        where: { uuid: input.uuid },
        include: { users: true },
      });

      console.log(find);

      if (find) {
        // then add us to the users.
        return await ctx.prisma.rdatasource.update({
          where: { uuid: input.uuid },
          data: {
            users: { connect: { id: ctx.session?.user?.id } },
          },
        });
      }

      // if (find && find.userid !== ctx.user.id) throw new TRPCError({
      //     code: "FORBIDDEN",
      //     message: `Device with this uuid already added by ${find.user[]}.`
      // });

      // if (find && find.userid === ctx.user.id) throw new TRPCError({
      //     code: "FORBIDDEN",
      //     message: `Device with this uuid already added by you.`
      // })

      return new TRPCError({
        code: "NOT_FOUND",
        message: "The device with this uuid was not found.",
      });
    }),
  findMany: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session?.user?.id === undefined)
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

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
        id: ctx.session.user.id,
      },
      select: {
        datasources: {
          include: {
            users: {
              select: { email: true },
            },
            inputs: true,
            outputs: true,
          },
        },
      },
    });

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
  }),
  realtime: protectedProcedure
    .input(z.object({ uuid: z.string() }))
    .subscription(async ({ ctx, input }) => {
      if (ctx.session?.user?.id === undefined) return;

      const check = await ctx.prisma.rdatasource.findFirst({
        where: {
          uuid: input.uuid,
          users: {
            some: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      if (!check)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Can not subscribe to device you are not linked to.",
        });

      return observable<RdataWithInOut>((emit) => {
        const onData = (data: RdataWithInOut) => {
          if (data.uuid === check.uuid) emit.next(data);
        };
        realtimeEvents.on("datasource", onData);
        return () => {
          realtimeEvents.off("datasource", onData);
        };
      });
    }),
});

export type RdataWithInOut = Rdatasource & {
  inputs: Rinput[];
  outputs: Routput[];
};
