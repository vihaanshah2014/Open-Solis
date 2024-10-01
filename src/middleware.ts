import { authMiddleware } from "@clerk/nextjs/server"; // Correct import for middleware

export default authMiddleware({
  publicRoutes: ["/", "/waitlist", "/why-solis", "/careers", "/terms-of-use", "/policy", "privacy","/api/waitlist", "/api/webhook"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
