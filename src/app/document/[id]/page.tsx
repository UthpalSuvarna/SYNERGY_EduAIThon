import { prisma } from "@/lib/prisma-edge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, BrainCircuit } from "lucide-react";

export default async function SubjectPage({
    params,
}: {
    params: { id: string };
}) {
    const docInfo = await prisma.documents.findUnique({
        where: {
            id: params.id,
        },
    });

    const topics = await prisma.topic.findMany({
        where: {
            documentId: docInfo?.id,
        },
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6 px-4 py-8">
            {topics.map((topic) => (
                <Card key={topic.id} className="w-full rounded-2xl shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold line-clamp-2">
                            {topic.topicName}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {"No description available"}
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3">
                        <form action={`/flashcards/${topic.id}`}>
                            <Button variant="outline" className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                Flashcards
                            </Button>
                        </form>
                        <form action={`/quiz/${topic.id}`}>
                            <Button className="flex items-center gap-1">
                                <BrainCircuit className="h-4 w-4" />
                                Quiz
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
