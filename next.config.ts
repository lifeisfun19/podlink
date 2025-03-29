import dotenv from "dotenv";
dotenv.config();

const nextConfig = {
  env: {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

export default nextConfig;

module.exports = nextConfig;
