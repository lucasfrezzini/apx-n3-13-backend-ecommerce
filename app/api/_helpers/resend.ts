import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export function sendEmail(email: string, code: string) {
  resend.emails.send({
    from: `ACME <onboarding@resend.dev>`,
    to: email,
    subject: "Enviado desde la App de TanoDevvv",
    html: `Tu codigo para acceder es: <strong>${code}</strong>`,
  });
}
