"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Send, FileText } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
    id: string
    content: string
    role: "user" | "assistant"
    timestamp: Date
}

interface ChatInterfaceProps {
    documentId: string
    documentName: string
    fileUrl: string
    chatUrl: string
    userId: string
}

export default function ChatInterface({ documentId, documentName, fileUrl, chatUrl, userId }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            content: `Hello! I'm your PDF assistant. Ask me anything about "${documentName}"`,
            role: "assistant",
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Scroll to bottom when messages change
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current
            scrollContainer.scrollTop = scrollContainer.scrollHeight
        }
    }, [messages])

    async function handleSendMessage(e: React.FormEvent) {
        e.preventDefault()

        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            role: "user",
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch(chatUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pdf_url: fileUrl,
                    query: input.trim(),
                    session_id: userId,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to get response")
            }

            const data = await response.json()

            const assistantMessage: Message = {
                id: Date.now().toString(),
                content: data.answer || "I couldn't find an answer to that question in the document.",
                role: "assistant",
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, assistantMessage])
        } catch (error) {
            console.error("Error querying PDF:", error)

            const errorMessage: Message = {
                id: Date.now().toString(),
                content: "Sorry, I encountered an error processing your request. Please try again.",
                role: "assistant",
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto max-w-4xl py-6">
            <Card className="border shadow-md">
                <CardHeader className="border-b bg-muted/50">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-medium">{documentName}</CardTitle>
                    </div>
                </CardHeader>
                <div className="relative">
                    <ScrollArea ref={scrollAreaRef} className="h-[60vh] p-4">
                        <div className="space-y-4 pb-4">
                            {messages.map((message) => (
                                <ChatMessage key={message.id} message={message} />
                            ))}
                            {isLoading && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <p className="text-sm">Thinking...</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
                <CardFooter className="border-t p-4">
                    <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                        <Input
                            placeholder="Ask a question about the document..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            <span className="sr-only">Send message</span>
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}

function ChatMessage({ message }: { message: Message }) {
    const isUser = message.role === "user"

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[80%] gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
                <Avatar className={`h-8 w-8 ${isUser ? "bg-primary" : "bg-secondary"}`}>
                    <div className="flex h-full items-center justify-center text-xs font-semibold">{isUser ? "You" : "AI"}</div>
                </Avatar>
                <div className={`rounded-lg px-4 py-2 text-sm ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {message.content}
                </div>
            </div>
        </div>
    )
}
