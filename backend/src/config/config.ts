import dotenv from "dotenv";
import type { StringValue } from "ms";

dotenv.config();

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpiry: "45m" as StringValue,
    refreshExpiry: "7d" as StringValue,
  },
};
export default config;

interface Config {
  port: Number;
  nodeEnv: string;
  jwt: JwtConfig;
}
interface JwtConfig {
  accessSecret: string;
  refreshSecret: string;
  accessExpiry: StringValue;
  refreshExpiry: StringValue;
}
