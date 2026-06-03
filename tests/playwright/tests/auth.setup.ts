import { test as setup } from "@playwright/test";
import fs from "fs";

////////////////////////////////////////
// Authentication for Assignment 2 & 3
////////////////////////////////////////

setup(
  "authenticate",
  { tag: "@a2" },
  async ({ playwright }) => {
    const authFile = ".auth/user.json";
    fs.mkdirSync(".auth", { recursive: true });

    // Try JWT auth first (Assignment 3)
    try {
      const apiContext = await playwright.request.newContext({
        baseURL: "http://localhost:3002",
      });

      await apiContext.post("/api/auth", {
        data: JSON.stringify({ password: "123" }),
        headers: { "Content-Type": "application/json" },
      });

      await apiContext.storageState({ path: authFile });
    } catch {
      // Fallback: write legacy password cookie for CI environments
      // where the admin server may not be ready during setup
      const content = {
        cookies: [
          {
            name: "password",
            value: "123",
            domain: "localhost",
            secure: false,
            expires: -1,
            path: "/",
            httpOnly: false,
            sameSite: "Lax",
          },
        ],
      };
      fs.writeFileSync(authFile, JSON.stringify(content, null, 2));
    }
  },
);
