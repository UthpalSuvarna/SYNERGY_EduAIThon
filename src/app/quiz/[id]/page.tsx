"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "../../../components/ui/skeleton"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

// Define types for our quiz data
interface Option {
    id: string
    text: string
}

interface Question {
    id: string
    question: string
    options: Option[]
    correctAnswer: string
}

interface QuizState {
    questions: Question[]
    currentQuestionIndex: number
    answers: Record<string, string>
    isSubmitting: boolean
    isCompleted: boolean
    score: number
    error: string | null
    isLoading: boolean
}

export default function QuizContainer({ params }: { params: { id: string } }) {
    const [quizState, setQuizState] = useState<QuizState>({
        questions: [],
        currentQuestionIndex: 0,
        answers: {},
        isSubmitting: false,
        isCompleted: false,
        score: 0,
        error: null,
        isLoading: true,
    })

    // Fetch questions from API
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await fetch(`/api/questions?topicid=${params.id}`, {
                    method: "GET",
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch questions")
                }

                const data = await response.json()
                setQuizState((prev) => ({
                    ...prev,
                    questions: data,
                    isLoading: false,
                }))
            } catch (error) {
                setQuizState((prev) => ({
                    ...prev,
                    error: "Failed to load quiz questions. Please try again later.",
                    isLoading: false,
                }))
            }
        }

        fetchQuestions()
    }, [])

    const handleAnswerSelect = (questionId: string, optionId: string) => {
        setQuizState((prev) => ({
            ...prev,
            answers: {
                ...prev.answers,
                [questionId]: optionId,
            },
        }))
    }

    const handleNextQuestion = () => {
        if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
            setQuizState((prev) => ({
                ...prev,
                currentQuestionIndex: prev.currentQuestionIndex + 1,
            }))
        }
    }

    const handlePreviousQuestion = () => {
        if (quizState.currentQuestionIndex > 0) {
            setQuizState((prev) => ({
                ...prev,
                currentQuestionIndex: prev.currentQuestionIndex - 1,
            }))
        }
    }

    const calculateScore = () => {
        let score = 0
        quizState.questions.forEach((question) => {
            if (quizState.answers[question.id] === question.correctAnswer) {
                score++
            }
        })
        return score
    }

    const handleSubmitQuiz = async () => {
        setQuizState((prev) => ({
            ...prev,
            isSubmitting: true,
        }))

        const score = calculateScore()
        const totalQuestions = quizState.questions.length

        try {
            // Replace with your actual API endpoint for submitting results
            const response = await fetch("/api/results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    score,
                    totalQuestions,
                    answers: quizState.answers,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to submit quiz results")
            }

            setQuizState((prev) => ({
                ...prev,
                isSubmitting: false,
                isCompleted: true,
                score,
            }))
        } catch (error) {
            setQuizState((prev) => ({
                ...prev,
                isSubmitting: false,
                error: "Failed to submit quiz results. Please try again.",
            }))
        }
    }

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex]
    const isAnswered = currentQuestion && quizState.answers[currentQuestion.id]
    const isLastQuestion = quizState.currentQuestionIndex === quizState.questions.length - 1
    const answeredQuestionsCount = Object.keys(quizState.answers).length
    const progress = quizState.questions.length > 0 ? (answeredQuestionsCount / quizState.questions.length) * 100 : 0

    if (quizState.isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            </div>
        )
    }

    if (quizState.error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Alert variant="destructive" className="max-w-2xl">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{quizState.error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    if (quizState.isCompleted) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Quiz Completed!</CardTitle>
                        <CardDescription>Thank you for completing the quiz. Here are your results:</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-center flex-col p-6">
                            <div className="text-6xl font-bold mb-4">
                                {quizState.score} / {quizState.questions.length}
                            </div>
                            <p className="text-lg text-center">
                                You answered {quizState.score} out of {quizState.questions.length} questions correctly.
                            </p>
                        </div>
                        <Alert>
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>Your quiz results have been successfully submitted.</AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => window.location.reload()}>
                            Take Another Quiz
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    if (quizState.questions.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Alert className="max-w-2xl">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Questions Available</AlertTitle>
                    <AlertDescription>
                        There are no quiz questions available at the moment. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                        <CardTitle>Quiz</CardTitle>
                        <span className="text-sm font-medium">
                            Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
                        </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>
                    <RadioGroup
                        value={quizState.answers[currentQuestion.id] || ""}
                        onValueChange={(value: string) => handleAnswerSelect(currentQuestion.id, value)}
                        className="space-y-3"
                    >
                        {currentQuestion.options.map((option) => (
                            <div
                                key={option.id}
                                className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${quizState.answers[currentQuestion.id] === option.id ? "bg-gray-100 border-gray-300" : "hover:bg-gray-50"
                                    }`}
                                onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                            >
                                <RadioGroupItem value={option.id} id={option.id} />
                                <Label htmlFor={option.id} className="flex-grow cursor-pointer">
                                    {option.text}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handlePreviousQuestion} disabled={quizState.currentQuestionIndex === 0}>
                        Previous
                    </Button>
                    <div className="flex space-x-2">
                        {isLastQuestion ? (
                            <Button
                                onClick={handleSubmitQuiz}
                                disabled={answeredQuestionsCount !== quizState.questions.length || quizState.isSubmitting}
                            >
                                {quizState.isSubmitting ? "Submitting..." : "Submit Quiz"}
                            </Button>
                        ) : (
                            <Button onClick={handleNextQuestion} disabled={!isAnswered}>
                                Next
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
