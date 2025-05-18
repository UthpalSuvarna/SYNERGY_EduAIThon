"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react"

interface Flashcard {
    id: number
    question: string
    answer: string
}

export function Flashcards({ topicId }: { topicId: string }) {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const response = await fetch(`/api/flashcards?topicId=${topicId}`, {
                    method: "GET"
                })
                const data = await response.json()
                setFlashcards(data)
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching flashcards:", error)
                setIsLoading(false)
            }
        }

        fetchFlashcards()
    }, [])

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1)
            setIsFlipped(false)
        }
    }

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
            setIsFlipped(false)
        }
    }

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-[300px] w-full rounded-xl" />
                <div className="flex justify-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
            </div>
        )
    }

    if (flashcards.length === 0) {
        return <div className="text-center p-8">No flashcards available.</div>
    }

    const currentCard = flashcards[currentIndex]

    return (
        <div className="space-y-6">
            <div className="relative perspective-1000 cursor-pointer" onClick={handleFlip}>
                <div
                    className={`relative transition-all duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}
                    style={{
                        transformStyle: "preserve-3d",
                        transition: "transform 0.6s",
                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                >
                    {/* Front of card (Question) */}
                    <Card
                        className="p-8 min-h-[300px] flex flex-col items-center justify-center text-center backface-hidden"
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        <h3 className="text-xl font-semibold mb-2">Question:</h3>
                        <p className="text-lg">{currentCard.question}</p>
                        <div className="mt-4 text-sm text-muted-foreground">Click to reveal answer</div>
                    </Card>

                    {/* Back of card (Answer) */}
                    <Card
                        className="p-8 min-h-[300px] flex flex-col items-center justify-center text-center absolute inset-0 backface-hidden rotate-y-180"
                        style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                        }}
                    >
                        <h3 className="text-xl font-semibold mb-2">Answer:</h3>
                        <p className="text-lg">{currentCard.answer}</p>
                        <div className="mt-4 text-sm text-muted-foreground">Click to see question</div>
                    </Card>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Card {currentIndex + 1} of {flashcards.length}
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentIndex === 0}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous card</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleFlip}>
                        <RotateCw className="h-4 w-4" />
                        <span className="sr-only">Flip card</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNext} disabled={currentIndex === flashcards.length - 1}>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next card</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
