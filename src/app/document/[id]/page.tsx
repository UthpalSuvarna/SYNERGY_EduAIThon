import { prisma } from "@/lib/prisma-edge"

export default async function SubjectPage({ params }: { params: { id: string } }) {
    const docInfo = await prisma.documents.findUnique({
        where: {
            id: params.id
        }
    })

    const topics = await prisma.topic.findMany({
        where: {
            documentId: docInfo?.id
        }
    })

    return (
        <div>
            <h1>{docInfo?.name}</h1>
            <ul>
                {topics.map((topic) => (
                    <li key={topic.id}>{topic.topicName}</li>
                ))}
            </ul>
        </div>
    )
}