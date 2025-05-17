import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma-edge";
// const FLASH_API_URL =

// Mock data for demonstration purposes
// In a real application, this would come from a database or external API
const flashcardsData = [
    {
        id: 1,
        question: "What is React?",
        answer: "React is a JavaScript library for building user interfaces, particularly single-page applications.",
    },
    {
        id: 2,
        question: "What is JSX?",
        answer: "JSX is a syntax extension for JavaScript that looks similar to HTML and allows us to write HTML in React.",
    },
    {
        id: 3,
        question: "What is a React component?",
        answer:
            "A component is a reusable piece of code that returns React elements describing what should appear on the screen.",
    },
    {
        id: 4,
        question: "What is the virtual DOM?",
        answer:
            "The virtual DOM is a lightweight copy of the actual DOM in memory that React uses to improve performance by minimizing direct manipulation of the DOM.",
    },
    {
        id: 5,
        question: "What are React hooks?",
        answer: "Hooks are functions that let you use state and other React features without writing a class component.",
    },
]

export async function GET(request: Request) {
    // Simulate API delay
    //await new Promise((resolve) => setTimeout(resolve, 1000))
    // const { searchParams } = new URL(request.url, 'http://localhost');
    // const topicid = searchParams.get("topicid");

    // const topicInfo = await prisma.topic.findUnique({
    //     where: {
    //         id: topicid || undefined
    //     }
    // })

    // const docInfo = await prisma.documents.findUnique({
    //     where: {
    //         id: topicInfo?.documentId
    //     }
    // })

    // const rawResponse = await fetch(FLASH_API_URL, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ topic: topicInfo?.topicName, pdf_url: docInfo?.fileUrl }),
    // });

    return NextResponse.json(flashcardsData)
}
