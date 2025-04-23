import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/database/db";
import * as schema from "@/database/schema";
import {
  organization,
  admin,
  emailOTP,
  magicLink,
  phoneNumber,
  username,
  genericOAuth,
  oneTap,
} from "better-auth/plugins";

export const auth = betterAuth({
  //   database: drizzleAdapter(db, {
  //     provider: "pg",
  //     usePlural: true,
  //     schema,
  //   }),
  //   emailAndPassword: {
  //     enabled: true,
  //   },
  //   plugins: [
  //     // organization({
  //     //   creatorRole: "superadmin",
  //     //   memberRoles: ["admin", "member"],
  //     //   membershipLimit: 10,
  //     //   sendInvitationEmail: async (input) => {
  //     //     console.log(input);
  //     //   },
  //     // }),
  //     // admin({
  //     //   adminRoles: ["admin", "superadmin"],
  //     // }),
  //     // emailOTP({
  //     //   sendVerificationOTP: async (input) => {
  //     //     console.log(input);
  //     //   },
  //     // }),
  //     // magicLink({
  //     //   sendMagicLink(data, request) {
  //     //     console.log(data, request);
  //     //   },
  //     // }),
  //     // phoneNumber({
  //     //   sendOTP: async (input) => {
  //     //     console.log(input);
  //     //   },
  //     // }),
  //     // username(),
  //     // genericOAuth({ config: [] }),
  //     // oneTap(),
  //   ],
});
