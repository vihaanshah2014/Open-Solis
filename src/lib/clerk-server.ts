import { clerkClient } from "@clerk/nextjs";

// Ensure the environment variable is set correctly
if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("Missing Clerk API key.");
}

// Use clerkClient directly
export const clerk = clerkClient;

// If you need to set the secret key manually (usually not necessary with Next.js):
// clerkClient.setSecretKey(process.env.CLERK_SECRET_KEY);