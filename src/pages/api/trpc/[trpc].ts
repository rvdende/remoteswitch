import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "@/env/server.mjs";
import { createContext } from "@/server/trpc/context";
import type { AppRouter} from "@/server/trpc/router/_app";
import { appRouter } from "@/server/trpc/router/_app";

// export API handler
export default createNextApiHandler<AppRouter>({
  router: appRouter,
  /**
   * @link https://trpc.io/docs/context
   */
  createContext,
  /**
  * @link https://trpc.io/docs/error-handling
  */
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
        console.error(`❌ tRPC failed on ${path}: ${error}`);
      }
      : undefined,
  batching: {
    enabled: true,
  },
});
