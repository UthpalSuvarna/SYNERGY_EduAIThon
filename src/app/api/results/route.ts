import { prisma } from "../../../lib/prisma-edge"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        //const { score, totalQuestions, answers, userId, topicId } = body
        console.log(body)
        await prisma.score.create({
            data: {
                score: body.score,
                userId: body.userId,
                topicId: body.topicId,
            },
        })

        // In a real implementation, you would send this data to your external API
        // const response = await fetch('https://your-results-api.com/submit', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ score, totalQuestions, answers }),
        // });

        // if (!response.ok) {
        //   throw new Error('Failed to submit results to external API');
        // }

        // For demonstration, we'll just log the data and return a success response
        //console.log("Quiz results submitted:", { score, totalQuestions, answers })

        return NextResponse.json({
            success: true,
            message: "Quiz results submitted successfully",
            //data: { score, totalQuestions },
        })
    } catch (error) {
        console.error("Error submitting quiz results:", error)
        return NextResponse.json({ error: "Failed to submit quiz results" }, { status: 500 })
    }
}
