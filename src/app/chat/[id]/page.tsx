import { auth } from "@/auth"
import { prisma } from "@/lib/prisma-edge"
import ChatInterface from "./chat-interface"

const CHAT_URL = "https://372e-2401-4900-91df-62f4-1fe-4419-487b-86fc.ngrok-free.app/query_pdf"

export default async function Chat({ params }: { params: { id: string } }) {
    const session = await auth()

    const docInfo = await prisma.documents.findUnique({
        where: {
            id: params.id,
        },
    })

    if (!docInfo) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Document not found</h2>
                    <p className="text-muted-foreground mt-2">
                        The document you're looking for doesn't exist or has been removed.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <ChatInterface
            documentId={params.id}
            documentName={docInfo.name || "Document"}
            fileUrl={docInfo.fileUrl}
            chatUrl={CHAT_URL}
            userId={session?.user?.id || "default_session_id"}
        />
    )
}
