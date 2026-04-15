import { createEnv } from "@t3-oss/env-nextjs";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(config());

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]),
    FIREBASE_PROJECT_ID: z.string().min(1),
    FIREBASE_CLIENT_EMAIL: z.string().min(1),
    FIREBASE_PRIVATE_KEY: z.string().min(1),
  },
  onValidationError: (issues) => {
    console.error("Invalid environment variables:", issues);
    process.exit(1);
  },

  // eslint-disable-next-line n/no-process-env
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  emptyStringAsUndefined: true,

  // eslint-disable-next-line n/no-process-env
  experimental__runtimeEnv: process.env,
});
