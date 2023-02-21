// src/server/router/_app.ts
import { router } from "../trpc";

import { computersRouter } from "./computers";
import { rulesRouter } from "./rules";

export const appRouter = router({
  computersRouter,
  rulesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
