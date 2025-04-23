import { bench } from "@ark/attest";
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

// baseline was set on 1.2.7, now on 1.2.5 is installed, which is my project version.

bench("plain", () => {
  return betterAuth({});
}).types([13, "instantiations"]);

bench("drizzle", () => {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: true,
      schema,
    }),
  });
}).types([58682, "instantiations"]);

bench("org", () => {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: true,
      schema,
    }),
    plugins: [
      organization({
        creatorRole: "superadmin",
        memberRoles: ["admin", "member"],
        membershipLimit: 10,
        sendInvitationEmail: async (input) => {
          console.log(input);
        },
      }),
    ],
  });
}).types([62542, "instantiations"]);

bench("admin", () => {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: true,
      schema,
    }),
    plugins: [
      admin({
        adminRoles: ["admin", "superadmin"],
      }),
    ],
  });
}).types([61512, "instantiations"]);

bench("emailOTP", () => {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: true,
      schema,
    }),
    plugins: [
      emailOTP({
        sendVerificationOTP: async (input) => {
          console.log(input);
        },
      }),
    ],
  });
}).types([59996, "instantiations"]);

bench("magicLink", () => {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: true,
      schema,
    }),
    plugins: [
      magicLink({
        sendMagicLink: async (input) => {
          console.log(input);
        },
      }),
    ],
  });
}).types([58926, "instantiations"]);

bench("phoneNumber", () => {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: true,
      schema,
    }),
    plugins: [
      phoneNumber({
        sendOTP: async (input) => {
          console.log(input);
        },
      }),
    ],
  });
}).types([59000, "instantiations"]);

bench("genericOAuth", () => {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: true,
      schema,
    }),
    plugins: [genericOAuth({ config: [] })],
  });
}).types([60138, "instantiations"]);

bench("username", () => {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: true,
      schema,
    }),
    plugins: [username()],
  });
}).types([59718, "instantiations"]);

bench("oneTap", () => {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: true,
      schema,
    }),
    plugins: [oneTap()],
  });
}).types([58793, "instantiations"]);

bench("all", () => {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: true,
      schema,
    }),
    plugins: [
      organization({
        creatorRole: "superadmin",
        memberRoles: ["admin", "member"],
        membershipLimit: 10,
        sendInvitationEmail: async (input) => {
          console.log(input);
        },
      }),
      admin({
        adminRoles: ["admin", "superadmin"],
      }),
      emailOTP({
        sendVerificationOTP: async (input) => {
          console.log(input);
        },
      }),
      magicLink({
        sendMagicLink: async (input) => {
          console.log(input);
        },
      }),
      phoneNumber({
        sendOTP: async (input) => {
          console.log(input);
        },
      }),
      genericOAuth({ config: [] }),
      username(),
      oneTap(),
    ],
  });
}).types([66967, "instantiations"]);

bench("my-project", async () => {
  const myProject = await import("./complex-auth").then((m) => m.auth);
  return myProject;
}).types([68410, "instantiations"]);
