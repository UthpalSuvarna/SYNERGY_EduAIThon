import { Flashcards } from "./flashcards"

export default function Home({ params }: { params: { id: string } }) {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-24 bg-gray-50">
            <div className="w-full max-w-3xl">
                <h1 className="text-3xl font-bold text-center mb-8">Flashcards</h1>
                <Flashcards topicId={params.id} />
            </div>
        </main>
    )
}