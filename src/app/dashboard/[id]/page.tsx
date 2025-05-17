// /app/dashboard/[id]/page.tsx
import { prisma } from '../../../lib/prisma-edge';
import React from 'react';

type Props = { params: { id: string } };

export default async function DashboardPage({ params }: Props) {
    const classId = params.id;

    // Fetch class with documents, topics, and scores
    const adminClass = await prisma.adminClass.findUnique({
        where: { id: classId },
        select: {
            id: true,
            className: true,
            description: true,
            documents: {
                select: {
                    id: true,
                    name: true,
                    topics: {
                        select: {
                            id: true,
                            topicName: true,
                            scores: {
                                select: {
                                    userId: true,
                                    score: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!adminClass) {
        return <h2>Class with ID {classId} not found.</h2>;
    }

    type UserAverage = {
        userId: string;
        averageScore: number;
    };

    type TopicLeaderboard = {
        topicId: string;
        topicName: string;
        leaderboard: UserAverage[]; // sorted descending by avg score
    };

    const topicLeaderboards: TopicLeaderboard[] = [];

    for (const doc of adminClass.documents) {
        for (const topic of doc.topics) {
            // Group scores by userId
            const userScoresMap: Record<string, number[]> = {};

            for (const score of topic.scores) {
                if (!userScoresMap[score.userId]) {
                    userScoresMap[score.userId] = [];
                }
                userScoresMap[score.userId].push(score.score);
            }

            // Calculate average score per user
            const userAverages: UserAverage[] = [];

            for (const userId in userScoresMap) {
                const scores = userScoresMap[userId];
                const sum = scores.reduce((a, b) => a + b, 0);
                const avg = +(sum / scores.length).toFixed(2);
                userAverages.push({ userId, averageScore: avg });
            }

            // Sort descending by average score
            userAverages.sort((a, b) => b.averageScore - a.averageScore);

            topicLeaderboards.push({
                topicId: topic.id,
                topicName: topic.topicName,
                leaderboard: userAverages,
            });
        }
    }

    return (
        <main style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'sans-serif' }}>
            <h1>{adminClass.className}</h1>
            {adminClass.description && <p style={{ color: '#666' }}>{adminClass.description}</p>}

            <section style={{ marginTop: 30 }}>
                <h2>Documents</h2>
                <table
                    border={1}
                    cellPadding={6}
                    style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 30 }}
                >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>#Topics</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminClass.documents.map((doc) => (
                            <tr key={doc.id}>
                                <td>{doc.name}</td>
                                <td>{doc.topics.length}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section>
                <h2>Topic Leaderboards (Avg Score per User)</h2>
                {topicLeaderboards.length === 0 ? (
                    <p>No topics or scores found.</p>
                ) : (
                    topicLeaderboards.map(({ topicId, topicName, leaderboard }) => (
                        <div key={topicId} style={{ marginBottom: 40 }}>
                            <h3>{topicName}</h3>
                            {leaderboard.length === 0 ? (
                                <p>No scores yet.</p>
                            ) : (
                                <table
                                    border={1}
                                    cellPadding={6}
                                    style={{ borderCollapse: 'collapse', width: '100%' }}
                                >
                                    <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>User ID</th>
                                            <th>Average Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboard.map((entry, i) => (
                                            <tr key={entry.userId + i}>
                                                <td>{i + 1}</td>
                                                <td>{entry.userId}</td>
                                                <td>{entry.averageScore}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ))
                )}
            </section>
        </main>
    );
}
