import { MiddlewareConfig } from "next/server";

export { auth as middleware } from "@/auth";

export const config = {
    matcher: [
        /*
         * Match only the home page for unauthenticated users.
         * All other routes will require authentication.
         */
        "/",
    ],
};
