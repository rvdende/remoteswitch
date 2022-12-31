import { router } from "../trpc";
import { authRouter } from "./auth";
import { datasourceRouter } from "./datasource";

export const appRouter = router({
  auth: authRouter,
  datasource: datasourceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
