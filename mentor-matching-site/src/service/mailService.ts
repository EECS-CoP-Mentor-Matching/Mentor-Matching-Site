import { writeSingle } from "../dal/commonDb";
import { DbWriteResult } from "../types/types";

const MAIL_COLLECTION = "mail";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text }: SendEmailOptions): Promise<DbWriteResult> {
  return writeSingle(MAIL_COLLECTION, {
    to: Array.isArray(to) ? to : [to],
    message: { subject, text },
  });
}
