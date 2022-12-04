import { router } from "../trpc";
import { authRouter } from "./auth";
import { datasourceRouter } from "./datasource";
import { exampleRouter } from "./example";
import { realtimeRouter } from "./realtime";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  realtime: realtimeRouter,
  datasource: datasourceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
