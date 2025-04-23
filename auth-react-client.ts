import { createAuthClient } from "better-auth/react";
import {
  emailOTPClient,
  genericOAuthClient,
  magicLinkClient,
  oneTapClient,
  organizationClient,
  phoneNumberClient,
  usernameClient,
} from "better-auth/client/plugins";
import { adminClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({});
