import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-edge";

export default async function Profile() {
    const session = await auth();

    if (!session?.user?.id) {
        return <p className="p-4">Please log in to see your profile.</p>;
    }

    // Group scores by topicId and get average score per topic
    const scores = await prisma.score.groupBy({
        by: ["topicId"],
        where: {
            userId: session.user.id,
        },
        _avg: {
            score: true,
        },
    });

    // Get topic names for the topic IDs
    const topicIds = scores.map((s) => s.topicId);
    const topics = await prisma.topic.findMany({
        where: {
            id: {
                in: topicIds,
            },
        },
        select: {
            id: true,
            topicName: true,
        },
    });

    // Create a lookup map for topic names
    const topicMap = new Map(topics.map((t) => [t.id, t.topicName]));

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Welcome, {session.user.name}!</h1>

            <h2 className="text-xl font-semibold mb-4">Your Average Scores by Topic:</h2>
            {scores.length === 0 ? (
                <p className="text-gray-600">No scores recorded yet.</p>
            ) : (
                <ul className="space-y-3">
                    {scores.map((score) => (
                        <li
                            key={score.topicId}
                            className="border p-4 rounded-xl shadow-sm bg-white flex justify-between items-center"
                        >
                            <span className="text-gray-700 font-medium">
                                {topicMap.get(score.topicId) || "Unknown Topic"}
                            </span>
                            <span className="text-blue-600 font-semibold text-lg">
                                {score._avg.score?.toFixed(2)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
