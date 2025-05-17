import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

//@ts-ignore
export const prisma = new PrismaClient({ adapter });