import dotenv from "dotenv";
dotenv.config();

const config = {
  SECRET: String(process.env.SECRET),
  API_URL: String(process.env.API_URL),
  SERVER_ID: String(process.env.SERVER_ID),
  SERVER_KEY: String(process.env.SERVER_KEY),
  SECRET_TOKEN: String(process.env.SECRET_TOKEN),
};
export default config;
