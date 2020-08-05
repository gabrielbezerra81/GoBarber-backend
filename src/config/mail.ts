interface MailConfig {
  email: string;
  password: string;
}

export default {
  email: process.env.GMAIL_USER,
  password: process.env.GMAIL_PASS,
} as MailConfig;
