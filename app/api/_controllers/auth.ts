import AuthCodeService from "../_services/authCodeService";
import UserService from "../_services/userService";
import { sendEmail } from "../_helpers/resend";
import { randomNumber } from "../_helpers/random-number";
import { addMinutes } from "date-fns";

async function findOrCreateAuth(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  // Buscamos si hay un auth creado para ese email
  const authCodeService = new AuthCodeService();
  const auth = await authCodeService.getAuthByEmail(cleanEmail);
  if (auth) {
    auth.used = false; // Reseteamos el auth para que pueda ser usado
    await authCodeService.updateAuth(auth.id, { used: false });
    return auth;
  }
  // Si no hay auth, creamos un user nuevo y un auth nuevo
  const user = new UserService();
  const newUser = await user.createUser({ email: cleanEmail });

  const newAuth = await authCodeService.createAuth({
    email: cleanEmail,
    code: "",
    validUntil: new Date(),
    used: false,
  });
  return newAuth;
}

export async function sendCodeToEmail(email: string) {
  const auth = await findOrCreateAuth(email);

  const code = randomNumber().toString();
  const validUntil = addMinutes(new Date(), 30);
  auth.code = code;
  auth.validUntil = validUntil;

  const authCodeService = new AuthCodeService();
  await authCodeService.updateAuth(auth.id, {
    code,
    validUntil,
  });
  sendEmail(email, code);
  return auth;
}

export async function verifyAuthCode(
  email: string,
  code: string
): Promise<any> {
  const authCodeService = new AuthCodeService();
  const auth = await authCodeService.getAuthByEmail(email);
  if (!auth) {
    return false;
  }
  if (auth.used) {
    return false;
  }
  if (auth.code !== code) {
    return false;
  }
  if (auth.validUntil < new Date()) {
    return false;
  }
  await authCodeService.updateAuth(auth.id, { used: true });
  // Si todo es correcto, devolvemos true
  return auth;
}
