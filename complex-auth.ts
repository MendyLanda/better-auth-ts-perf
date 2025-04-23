import { db } from "@/database/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, apiKey, organization } from "better-auth/plugins";
import * as authSchema from "@/database/schema";
import { createAuthMiddleware, APIError } from "better-auth/api";

import * as bcrypt from "bcrypt";
import { and, eq, isNull } from "drizzle-orm";
import { generateId, type Model } from "@/generate-id";

const getDomainFromHost = (host: string | null | undefined) => {
  if (!host) {
    console.log("Got null or undefined host");
    return null;
  }
  if (host.trim() === "") {
    console.log("Got empty string host");
    return null;
  }

  const hostWithoutPort = host.split(":")[0];
  const parts = hostWithoutPort?.split(".") ?? [];
  const domain = parts.length > 2 ? parts.slice(-2).join(".") : hostWithoutPort;
  return domain;
};

export const getOrganizationFromDomain = async (domain: string) => {
  const org = await db.query.organization.findFirst({
    where: (organization, { sql }) =>
      sql`${organization.metadata} -> 'domains' @> ('["' || ${domain} || '"]')::jsonb`,
  });
  return org;
};

const getWorkizAccountsFromDomain = async (domain: string) => {
  const org = await getOrganizationFromDomain(domain);
  if (!org) {
    return null;
  }
  // blah blah blah
};

export const auth = betterAuth({
  appName: "Technician",
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      console.log("before", ctx.path);

      if (ctx.path === "/get-session") {
        const sessionCookie = ctx.getCookie("better-auth.session_token");
        const sessionId = sessionCookie?.split(".")[0];
        const sessionOrgCookie = ctx.getCookie("sess_aid")?.split(".")[0];
        // if no session, or if org is already set for this session, do nothing
        if (
          !sessionId ||
          (!!sessionOrgCookie && sessionOrgCookie === sessionId)
        ) {
          return;
        }

        const domain = getDomainFromHost(ctx.getHeader("host"));
        if (!domain) {
          throw new APIError("BAD_REQUEST", {
            message:
              "Host not found, this should not have happened, please contact the support team",
          });
        }

        if (domain === "localhost") {
          return;
        }

        const org = await getOrganizationFromDomain(domain);

        if (!org) {
          console.log("Organization not found");
          throw new APIError("BAD_REQUEST", {
            message: "Organization not found",
          });
        }

        await db
          .update(authSchema.session)
          .set({
            activeOrganizationId: org.id,
          })
          .where(eq(authSchema.session.token, sessionId));

        // so we can resolve the session quicker next time, knowing that the org is already set
        ctx.setCookie("sess_aid", sessionCookie, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        return;
      }

      if (ctx.path === "/forget-password") {
        const body = ctx.body as { email?: string };
        if (!body.email) {
          return;
        }
        // Make sure the user with this email is migrated
        // await db
        //   .update(authSchema.migratedUsers)
        //   .set({
        //     migratedCompletedAt: new Date(),
        //   })
        //   .where(
        //     and(
        //       eq(authSchema.migratedUsers.email, body.email),
        //       isNull(authSchema.migratedUsers.migratedCompletedAt)
        //     )
        //   );
      }

      if (ctx.path !== "/sign-in/email") {
        return;
      }

      const body = ctx.body as { email: string; password: string };
      const { email, password } = body;
      if (!email || !password) {
        return; // let the default handler error out
      }

      // const oldUser = await db.query.migratedUsers.findFirst({
      //   where: (migratedUsers, { eq, and, isNull }) =>
      //     and(
      //       eq(migratedUsers.email, email),
      //       isNull(migratedUsers.migratedCompletedAt) // only migrate users that are not migrated yet
      //     ),
      // });
      // if (!oldUser) {
      //   return; // this user was not on clerk or already migrated, no migration needed.
      // }

      // const oldPasswordHash = oldUser.oldPasswordHash;
      // const oldPasswordMatch = await bcrypt.compare(password, oldPasswordHash);
      // if (!oldPasswordMatch) {
      //   throw new APIError("BAD_REQUEST", {
      //     message: "Invalid email or password",
      //   });
      // }

      // const newHashedPassword = await ctx.context.password.hash(password);
      // await db
      //   .update(authSchema.account)
      //   .set({
      //     password: newHashedPassword,
      //   })
      //   .where(
      //     and(
      //       eq(authSchema.account.userId, oldUser.newUserId!),
      //       eq(authSchema.account.providerId, "credential")
      //     )
      //   );

      // await db
      //   .update(authSchema.migratedUsers)
      //   .set({
      //     migratedCompletedAt: new Date(),
      //   })
      //   .where(eq(authSchema.migratedUsers.email, email));

      return; // let the default login flow continue
    }),
  },
  user: {
    changeEmail: {
      enabled: false,
    },
    deleteUser: {
      enabled: false,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  plugins: [
    nextCookies(),
    organization({
      allowUserToCreateOrganization(user) {
        return user.id === process.env.BETTER_AUTH_SYSTEM_USER_ID;
      },
      membershipLimit: 500,
      creatorRole: "owner",
      roles: {
        technician: {
          authorize: () => ({ success: true }),
          statements: [],
        },
        admin: {
          authorize: () => ({ success: true }),
          statements: [],
        },
        owner: {
          authorize: () => ({ success: true }),
          statements: [],
        },
      },
    }),
    admin({
      adminRoles: ["admin", "system"],
      defaultRole: "user",
    }),
    apiKey({
      customAPIKeyGetter(ctx) {
        const header = ctx.headers?.get("Authorization");
        if (!header) {
          return null;
        }
        const [type, key] = header.split(" ");
        if (type !== "Bearer") {
          return null;
        }

        if (!key || key.trim() === "") {
          return null;
        }

        return key.trim();
      },
    }),
  ],
  trustedOrigins: ["http://tenant1.local:3000", "http://tenant2.local:3000"],
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    requireEmailVerification: false,
    async sendResetPassword({ token, user }, req) {
      const host = req?.headers.get("host");
      const domain = getDomainFromHost(host);
      if (!host || !domain) {
        throw new APIError("BAD_REQUEST", {
          message: "Host not found",
        });
      }
      const baseUrl = `http${
        process.env.NODE_ENV === "development" ? "" : "s"
      }://${host}`;
      const url = new URL(baseUrl);
      url.pathname = "/auth/reset-password";
      url.searchParams.set("token", token);

      const org = await getOrganizationFromDomain(domain);
      if (!org) {
        throw new APIError("BAD_REQUEST", {
          message: "Organization not found",
        });
      }

      // const html = await render(
      //   ResetPasswordEmail({
      //     url: url.toString(),
      //     name: user.name,
      //     siteName: org.name,
      //     baseUrl: baseUrl,
      //     imageUrl: org.logo,
      //   })
      // );

      const workizAccounts = await getWorkizAccountsFromDomain(domain);
      if (!workizAccounts?.[0]) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Could not find an email service to send the reset password email to, please contact support",
        });
      }

      // await tasks.trigger<typeof sendMessageTask>("send-message", {
      //   data: {
      //     email: user.email,
      //     content: cleanHtmlForWorkiz(html),
      //     via: "email",
      //     subject: "Password Reset Request",
      //   },
      //   workizAccountId: workizAccounts[0].appId,
      // });
    },
  },
  advanced: {
    generateId: (options) => generateId(options.model as Model),
  },
});
