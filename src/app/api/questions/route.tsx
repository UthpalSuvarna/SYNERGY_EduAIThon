// Removed incorrect import of 'request'
import { prisma } from "@/lib/prisma-edge";
import { NextResponse } from "next/server"

const RAW_QUIZ_API_URL = "https://73a0-103-213-211-203.ngrok-free.app/generate-quiz"

// This is a mock API endpoint that would be replaced with your actual API call
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url, 'http://localhost');
        const topicid = searchParams.get("topicid");
        // In a real implementation, you would fetch from your external API here
        // const response = await fetch('https://your-quiz-api.com/questions');
        // const data = await response.json();

        const topicInfo = await prisma.topic.findUnique({
            where: {
                id: topicid || undefined
            }
        })

        const docInfo = await prisma.documents.findUnique({
            where: {
                id: topicInfo?.documentId
            }
        })

        const rawResponse = await fetch(RAW_QUIZ_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic: topicInfo?.topicName, pdf_url: docInfo?.fileUrl }),
        });

        if (!rawResponse.ok) {
            return NextResponse.json({ error: "Failed to fetch raw quiz" }, { status: 502 });
        }


        const rawData = await rawResponse.json();


        const quizText: string = rawData.quiz

        // Parse raw quiz string into structured format
        const questionBlocks = quizText.split(/\n\s*\n/).filter(Boolean)

        const structuredQuiz = questionBlocks.map((block, index) => {
            const lines = block.trim().split("\n").filter(Boolean)
            const questionLine = lines[0]
            const question = questionLine.replace(/^Q\d+\.\s*/, "").trim()

            const options = lines
                .slice(1, 5)
                .map(line => {
                    const match = line.match(/^([A-D])\.\s+(.*)/)
                    return match
                        ? { id: match[1].toLowerCase(), text: match[2].trim() }
                        : null
                })
                .filter(Boolean)

            const answerLine = lines.find(l => l.startsWith("Answer:"))
            const correctAnswer = answerLine
                ? answerLine.split("Answer:")[1].trim().toLowerCase()
                : ""

            return {
                id: `q${index + 1}`,
                question,
                options,
                correctAnswer,
            }
        })

        return NextResponse.json(structuredQuiz)

        // For demonstration, we'll return mock data
        const mockQuestions = [
            {
                id: "q1",
                question: topicid,
                options: [
                    { id: "a", text: "London" },
                    { id: "b", text: "Berlin" },
                    { id: "c", text: "Paris" },
                    { id: "d", text: "Madrid" },
                ],
                correctAnswer: "c",
            },
            {
                id: "q2",
                question: "Which planet is known as the Red Planet?",
                options: [
                    { id: "a", text: "Venus" },
                    { id: "b", text: "Mars" },
                    { id: "c", text: "Jupiter" },
                    { id: "d", text: "Saturn" },
                ],
                correctAnswer: "b",
            },
            {
                id: "q3",
                question: "What is the largest mammal?",
                options: [
                    { id: "a", text: "Elephant" },
                    { id: "b", text: "Giraffe" },
                    { id: "c", text: "Blue Whale" },
                    { id: "d", text: "Polar Bear" },
                ],
                correctAnswer: "c",
            },
            {
                id: "q4",
                question: "Which language is used for web development?",
                options: [
                    { id: "a", text: "Java" },
                    { id: "b", text: "C++" },
                    { id: "c", text: "Python" },
                    { id: "d", text: "JavaScript" },
                ],
                correctAnswer: "d",
            },
            {
                id: "q5",
                question: "What is the chemical symbol for gold?",
                options: [
                    { id: "a", text: "Go" },
                    { id: "b", text: "Gd" },
                    { id: "c", text: "Au" },
                    { id: "d", text: "Ag" },
                ],
                correctAnswer: "c",
            },
        ]

        return NextResponse.json(mockQuestions)
    } catch (error) {
        console.error("Error fetching questions:", error)
        return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
    }
}
