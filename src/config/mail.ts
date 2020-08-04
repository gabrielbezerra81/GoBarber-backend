interface MailConfig {
  email: string;
  password: string;
}

export default {
  email: process.env.MAIL_USER,
  password: process.env.MAIL_PASS,
} as MailConfig;
