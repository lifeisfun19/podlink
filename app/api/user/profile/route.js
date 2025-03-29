import { authenticate } from "@/lib/auth";

export async function GET(req) {
  const auth = authenticate(req);
  if (auth.error) {
    return new Response(JSON.stringify({ message: auth.error }), { status: 401 });
  }

  return new Response(JSON.stringify({ message: "User authenticated", userId: auth.userId }), { status: 200 });
}
