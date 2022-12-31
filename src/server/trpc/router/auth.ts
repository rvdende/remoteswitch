import { router, publicProcedure, protectedProcedure } from "../trpc";

import { registerSchema } from "../../../validation/auth";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input;

      const exists = await ctx.prisma.user.findFirst({
        where: { email },
      });

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists.",
        });
      }

      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      const hash = bcrypt.hashSync(password, salt);

      const result = await ctx.prisma.user.create({
        data: {
          name,
          email,
          password: hash,
        },
      });

      return {
        status: 201,
        message: "Account created successfully",
        result: result.email,
      };
    }),
});
