import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: Number;
  nodeEnv: string;
}
const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
};
export default config;
