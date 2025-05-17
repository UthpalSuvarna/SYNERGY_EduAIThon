"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  role: "bot" | "user";
  text: string;
}

export default function ClassroomChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi! How can I help you with your classroom today?",
    },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");

    // Simulate bot reply (mock)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "user", text: trimmed },
        {
          role: "bot",
          text: `You asked: "${trimmed}". I'll get back to you shortly!`,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-10 flex flex-col items-center min-h-[80vh]">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-t-2xl">
          <CardTitle className="text-2xl text-center text-purple-700 font-bold">
            Classroom Chatbot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 min-h-[400px]">
            {/* Chat messages area */}
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-200 p-4 mb-4 max-h-96"
              id="chat-messages"
              aria-live="polite"
            >
              <div className="mb-2 flex flex-col gap-2">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`${
                      msg.role === "bot"
                        ? "self-start bg-gray-100 text-gray-800"
                        : "self-end bg-blue-100 text-blue-800"
                    } px-4 py-2 rounded-lg max-w-[80%]`}
                  >
                    <span className="font-semibold">
                      {msg.role === "bot" ? "Bot:" : "You:"}
                    </span>{" "}
                    {msg.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat input area */}
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                aria-label="Type your message"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition-colors disabled:opacity-50"
                disabled={!input.trim()}
                aria-label="Send message"
              >
                Send
              </button>
            </form>
            <div className="text-xs text-gray-400 text-center mt-2">
              Powered by your friendly classroom bot 🤖
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
