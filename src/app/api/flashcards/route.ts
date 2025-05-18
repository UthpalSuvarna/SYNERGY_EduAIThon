import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma-edge";
const FLASH_API_URL = "https://a5ab-2401-4900-61a4-9ec1-7896-dcc4-9178-5b6a.ngrok-free.app/generate_flashcards"

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
    try {
        const { searchParams } = new URL(request.url, 'http://localhost');
        const topicid = searchParams.get("topicId");
        console.log(topicid)
        if (!topicid) {
            throw new Error("Invalid or missing topicId");
        }

        const topicInfo = await prisma.topic.findUnique({
            where: {
                id: topicid
            }
        });

        if (!topicInfo) {
            throw new Error("Topic not found");
        }

        const docInfo = await prisma.documents.findUnique({
            where: {
                id: topicInfo.documentId
            }
        });

        if (!docInfo) {
            throw new Error("Document not found");
        }

        const rawResponse = await fetch(FLASH_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subtopic: topicInfo?.topicName, pdf_link: docInfo?.fileUrl }),
        });
        const responseData = await rawResponse.json();
        console.log(responseData.flashcards);

        //console.log(formattedResponse)
        //console.log(rawResponse.json())
        return NextResponse.json(responseData.flashcards)
    } catch (error) {
        console.log(error)
    }

    return NextResponse.json(flashcardsData)
}
