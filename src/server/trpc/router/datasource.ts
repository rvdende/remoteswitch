import { protectedProcedure, router } from "../trpc";
import type { Rdatasource, Rinput, Routput } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import EventEmitter from "events";
import { z } from "zod";

declare interface REventEmitter extends EventEmitter {
  /** when we receive a message from a datasource or device */
  on(event: "datasource", listener: (data: RdataWithInOut) => void): this;
  /** when we send a message to a datasource or device */
  on(
    event: "send",
    listener: (data: { uuid: string; inputId: string; value: string }) => void
  ): this;
}

export const realtimeEvents = new EventEmitter() as REventEmitter;

export const datasourceRouter = router({
  /** delete a datasource */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.rdatasource.delete({
        where: { id: input.id },
      });
    }),
  /** send data to a datasource */
  send: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        uid: z.string(),
        value: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      realtimeEvents.emit("send", input);
      // TODO: check if the datasource is online
      // TODO: return success/fail from the device
      return {};
    }),

  /** add a datasource to an account */
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

      if (find) {
        // then add us to the users.
        return await ctx.prisma.rdatasource.update({
          where: { uuid: input.uuid },
          data: {
            users: { connect: { id: ctx.session?.user?.id } },
          },
        });
      }

      return new TRPCError({
        code: "NOT_FOUND",
        message: "The device with this uuid was not found.",
      });
    }),
  /** get all datasources for an account */
  findMany: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session?.user?.id === undefined)
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

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

    return data?.datasources;
  }),
  /** listen to realtime updates on a datasource */
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
