import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { realtimeRouter } from "./realtime";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  realtime: realtimeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
