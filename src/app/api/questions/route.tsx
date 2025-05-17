import { NextResponse } from "next/server"

// This is a mock API endpoint that would be replaced with your actual API call
export async function GET() {
    try {
        // In a real implementation, you would fetch from your external API here
        // const response = await fetch('https://your-quiz-api.com/questions');
        // const data = await response.json();

        // For demonstration, we'll return mock data
        const mockQuestions = [
            {
                id: "q1",
                question: "What is the capital of France?",
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
