import { auth } from "@/auth";
import { notFound } from "next/navigation";
import QuizContainer from "./quix";

export default async function Quiz({ params }: { params: { id: string } }) {
    const session = await auth();
    if (!session?.user?.id) {
        return notFound()
    }
    return <>
        <QuizContainer topicId={params.id} userId={session.user?.id} />
    </>
}