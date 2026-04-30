import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
    NEXT_PUBLIC_INGEST_API_URL: z.string().optional(),
  },

  runtimeEnv: {
    NEXT_PUBLIC_FIREBASE_API_KEY:
      // eslint-disable-next-line n/no-process-env
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      // eslint-disable-next-line n/no-process-env
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      // eslint-disable-next-line n/no-process-env
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      // eslint-disable-next-line n/no-process-env
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      // eslint-disable-next-line n/no-process-env
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID:
      // eslint-disable-next-line n/no-process-env
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_INGEST_API_URL:
      // eslint-disable-next-line n/no-process-env
      process.env.NEXT_PUBLIC_INGEST_API_URL,
  },
});
