import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Ensure JWT_SECRET is properly loaded
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET is not defined in .env!");
  process.exit(1); // Stop the server if secret is missing
}

// 🔹 Hash user password before saving to DB
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// 🔹 Compare entered password with stored hash
export async function comparePassword(enteredPassword, storedHash) {
  return bcrypt.compare(enteredPassword, storedHash);
}

// 🔹 Generate JWT token after successful login
export function generateToken(user) {
  console.log("🔑 Signing JWT with secret:", JWT_SECRET);
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
}

// 🔹 Middleware to authenticate protected routes
export function authenticate(req) {
  try {
    const authHeader = req.headers.get("authorization"); // Ensure lowercase
    console.log("🔍 Received Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No valid token provided");
      return { error: "Unauthorized. No token provided." };
    }

    const token = authHeader.split(" ")[1]; // Extract token
    console.log("🔑 Extracted Token:", token);
    console.log("🔑 Expected JWT_SECRET for verification:", JWT_SECRET);

    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    console.log("✅ Token Verified! User ID:", decoded.id);

    return { userId: decoded.id }; // Return user ID
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return { error: "Invalid or expired token." };
  }
}
