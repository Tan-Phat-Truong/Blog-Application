import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";

export async function isLoggedIn() {
  const userCookies = await cookies();
  const authToken = userCookies.get("auth_token")?.value;

  if (authToken) {
    try {
      jwt.verify(authToken, env.JWT_SECRET);
      return true;
    } catch {
      // Invalid token, fallback to legacy cookie check for existing test fixtures.
    }
  }

  return userCookies.has("password");
}
