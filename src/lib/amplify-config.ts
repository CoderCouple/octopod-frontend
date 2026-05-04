import { Amplify } from "aws-amplify";

import { env } from "@/env/client";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      userPoolClientId: env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
      // Google OAuth requires a Cognito Hosted UI domain — not configured yet.
      // loginWith: {
      //   oauth: {
      //     domain: "your-domain.auth.us-west-2.amazoncognito.com",
      //     scopes: ["openid", "email", "profile"],
      //     redirectSignIn: ["http://localhost:3000/dashboard"],
      //     redirectSignOut: ["http://localhost:3000/login"],
      //     responseType: "code",
      //     providers: ["Google"],
      //   },
      // },
    },
  },
});
