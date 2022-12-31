import { type NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";
import type ws from "ws";
import type { inferAsyncReturnType } from "@trpc/server";
import { getSession } from "next-auth/react";
import { prisma } from "../db/client";
import type { IncomingMessage } from "http";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (
  opts:
    | CreateNextContextOptions
    | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
) => {
  const session = await getSession(opts);

  return {
    session,
    prisma,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
