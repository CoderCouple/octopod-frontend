import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_INGEST_API_URL: z.string().optional(),
    NEXT_PUBLIC_COGNITO_USER_POOL_ID: z.string().min(1),
    NEXT_PUBLIC_COGNITO_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_COGNITO_REGION: z.string().min(1),
  },

  /* eslint-disable n/no-process-env */
  runtimeEnv: {
    NEXT_PUBLIC_INGEST_API_URL: process.env.NEXT_PUBLIC_INGEST_API_URL,
    NEXT_PUBLIC_COGNITO_USER_POOL_ID:
      process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    NEXT_PUBLIC_COGNITO_REGION: process.env.NEXT_PUBLIC_COGNITO_REGION,
  },
  /* eslint-enable n/no-process-env */
});
