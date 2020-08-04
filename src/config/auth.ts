interface AuthConfig {
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export default {
  jwt: {
    secret: process.env.APP_SECRET,
    expiresIn: process.env.EXPIRES,
  },
} as AuthConfig;
