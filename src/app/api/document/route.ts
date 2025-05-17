import { prisma } from "@/lib/prisma-edge"
import { NextRequest, NextResponse } from "next/server"
import z from 'zod'


const documentSchema = z.object({
    name: z.string(),
    url: z.string(),
    ClassId: z.string()
})


export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json()
        const data = documentSchema.parse(body)


        const [fileName, filetype] = data.name.split('.')


        const result = await prisma.documents.create({
            data: {
                name: fileName,
                fileType: filetype,
                fileUrl: data.url,
                classId: data.ClassId
            }
        }
        )

        console.log(result)

        const topics = await fetch('https://73a0-103-213-211-203.ngrok-free.app/upload', {
            method: "POST",
            body: JSON.stringify({ pdfUrl: result.fileUrl }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (topics.body) {
            const topicsJson = await topics.json();
            console.log(topicsJson);

            if (topicsJson.topics && Array.isArray(topicsJson.topics)) {
                await prisma.topic.createMany({
                    data: topicsJson.topics.map((topic: string) => ({
                        topicName: topic,
                        documentId: result.id
                    }))
                });
            } else {
                console.log("Invalid topics format in the response");
            }
        } else {
            console.log("No body in the response");
        }
        // get the topics 
        // upload the topics into the database

        return NextResponse.json({
            message: "done"
        })
    } catch (error) {
        console.log("error" + error)
        return NextResponse.json({
            message: "Error in api/document" + error
        })
    }
}