import dotenv from "dotenv";

dotenv.config();

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1/test",

  clerk: {
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
    secretKey: process.env.CLERK_SECRET_KEY!,
  },
};
export default config;

interface Config {
  port: Number;
  nodeEnv: string;
  mongoUri: string;
  clerk: ClerkConfig;
}
interface ClerkConfig {
  publishableKey: string;
  secretKey: string;
}
