import AuthCodeService from "../_services/authCodeService";
import UserService from "../_services/userService";
import { sendEmail } from "../_helpers/resend";
import { randomNumber } from "../_helpers/random-number";
import { addMinutes } from "date-fns";
import { syncAllModels } from "../_database";

async function findOrCreateAuth(email: string) {
  await syncAllModels();
  const cleanEmail = email.trim().toLowerCase();
  const authCodeService = new AuthCodeService();
  const userService = new UserService();

  const auth = await authCodeService.getAuthByEmail(cleanEmail);
  if (auth) {
    auth.used = false;
    await authCodeService.updateAuth(auth.id, { used: false });
    return auth;
  }

  const user = await userService.getUserByEmail(cleanEmail);
  if (!user) {
    throw new Error("User not found");
  }

  const newAuth = await authCodeService.createAuth({
    userId: user.get("id") as string,
    email: cleanEmail,
    code: "",
    validUntil: new Date(),
    used: false,
  });
  return newAuth;
}

export async function sendCodeToEmail(email: string) {
  const isTestUser = email.trim().toLowerCase() === "test@apx.school";
  const auth = await findOrCreateAuth(email);

  if (isTestUser && auth.code && auth.validUntil > new Date()) {
    return auth;
  }

  const code = isTestUser ? "123456" : randomNumber().toString();
  const validUntil = isTestUser
    ? addMinutes(new Date(), 9999)
    : addMinutes(new Date(), 30);

  const authCodeService = new AuthCodeService();
  await authCodeService.updateAuth(auth.id, {
    code,
    validUntil,
  });

  if (!isTestUser) {
    sendEmail(email, code);
  }
  return auth;
}
export async function verifyAuthCode(
  email: string,
  code: string,
): Promise<any> {
  const authCodeService = new AuthCodeService();
  const auth = await authCodeService.getAuthByEmail(email);
  if (!auth) {
    return false;
  }
  const isTestUser = email.trim().toLowerCase() === "test@apx.school";
  if (auth.used && !isTestUser) {
    return false;
  }
  if (auth.code !== code) {
    return false;
  }
  if (auth.validUntil < new Date()) {
    return false;
  }
  if (!isTestUser) {
    await authCodeService.updateAuth(auth.id, { used: true });
  }
  // Si todo es correcto, devolvemos true
  return auth;
}
