import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import { type NodeHTTPCreateContextFnOptions } from '@trpc/server/adapters/node-http';
import type ws from 'ws';
import * as trpc from '@trpc/server';
import { getSession } from 'next-auth/react';
import { getServerAuthSession } from "../common/get-server-auth-session";
import { prisma } from "../db/client";
import { IncomingMessage } from "http";
import * as trpcNext from '@trpc/server/adapters/next';

type CreateContextOptions = {
  session: Session | null;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
// export const createContextInner = async (opts: CreateContextOptions) => {
//   return {
//     session: opts.session,
//     prisma,
//   };
// };

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
// export const createContext = async (opts: CreateNextContextOptions
//   | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>) => {
//   const { req, res } = opts;

//   // Get the session from the server using the unstable_getServerSession wrapper function

//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore
//   const session = await getServerAuthSession({ req, res });
//   // const session = await getSession({req, res});

//   return await createContextInner({
//     session,
//   });
// };

// export type Context = inferAsyncReturnType<typeof createContext>;



/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
 export const createContext = async (
  opts:
    | trpcNext.CreateNextContextOptions
    | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>,
) => {
  const session = await getSession(opts);

  console.log('createContext for', session?.user?.name ?? 'unknown user');

  return {
    session,
    prisma
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
