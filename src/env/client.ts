import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_INGEST_API_URL: z.string().optional(),
  },

  runtimeEnv: {
    NEXT_PUBLIC_INGEST_API_URL:
      // eslint-disable-next-line n/no-process-env
      process.env.NEXT_PUBLIC_INGEST_API_URL,
  },
});
