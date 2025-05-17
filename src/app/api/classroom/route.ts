import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma-edge"
import z from "zod"
import { describe } from "node:test";

const classroomSchema = z.object({
    classname: z.string(),
    description: z.string(),
    adminMail: z.string()
})


export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        console.log(body)
        const data = classroomSchema.parse(body);

        console.log(data)

        const result = await prisma.adminClass.create({
            data: {
                adminEmail: data.adminMail,
                className: data.classname,
                description: data.description
            }
        })

        console.log(result)

        return NextResponse.json({
            message: "done"
        })
    } catch (error) {
        return NextResponse.json({
            message: "Error " + error
        })
    }



}