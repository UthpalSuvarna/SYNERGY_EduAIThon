import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import { prisma } from "./lib/prisma-edge";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: "/signin",
        signOut: "/signout"
    },
    callbacks: {
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth;
        },
        redirect: async ({ url, baseUrl }) => {
            // Redirect to the homepage after sign-in/sign-out
            return baseUrl; // baseUrl is the homepage by default
        },
    },
});