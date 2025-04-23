import { customAlphabet } from "nanoid";

export type Model =
  | "user"
  | "account"
  | "session"
  | "verification"
  | "rate-limit"
  | "organization"
  | "member"
  | "invitation"
  | "jwks"
  | "passkey"
  | "two-factor"
  | "job";

const idPrefixes: Record<Model, string> = {
  user: "user_",
  account: "acct_",
  session: "sess_",
  verification: "ver_",
  "rate-limit": "rat_",
  organization: "org_",
  member: "mem_",
  invitation: "inv_",
  jwks: "jwk_",
  passkey: "pass_",
  "two-factor": "2fa_",
  job: "job_",
} as const;

const NANOID_LENGTH = 10;

const alphabet =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nanoid = customAlphabet(alphabet, NANOID_LENGTH);
export const generateId = (type: Model) => {
  const prefix = idPrefixes[type];
  return `${prefix}${nanoid()}`;
};

export const getIdCharLength = (type: Model) => {
  return idPrefixes[type].length + NANOID_LENGTH;
};
