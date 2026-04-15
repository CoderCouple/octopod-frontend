import {
  type ServiceAccount,
  cert,
  getApp,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { type Auth, getAuth } from "firebase-admin/auth";

let _adminAuth: Auth | null = null;

export function getAdminAuth(): Auth {
  if (_adminAuth) return _adminAuth;

  /* eslint-disable n/no-process-env */
  const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };
  /* eslint-enable n/no-process-env */

  const app = getApps().length
    ? getApp()
    : initializeApp({ credential: cert(serviceAccount) });

  _adminAuth = getAuth(app);
  return _adminAuth;
}
