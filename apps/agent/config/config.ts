import dotenv from "dotenv";
dotenv.config();

const config = {
  API_URL: String(process.env.API_URL || "http://localhost:3007/agent"),
  SERVER_ID: String(process.env.SERVER_ID || ""),
  SERVER_KEY: String(process.env.SERVER_KEY || ""),
  SECRET_TOKEN: String(process.env.SECRET_TOKEN || process.env.SECRET || ""),
};
export default config;
