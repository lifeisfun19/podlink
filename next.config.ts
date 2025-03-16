import dotenv from "dotenv";
dotenv.config();


const nextConfig = {
  env: {
    MONGO_URI: process.env.MONGO_URI,
  },
};

export default nextConfig;

module.exports = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
};
