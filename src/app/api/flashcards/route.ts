import { NextResponse } from "next/server"

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

export async function GET() {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json(flashcardsData)
}
