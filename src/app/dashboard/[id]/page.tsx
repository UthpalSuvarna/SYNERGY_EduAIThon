import { prisma } from "@/lib/prisma-edge";
import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Props = { params: { id: string } };

export default async function DashboardPage({ params }: Props) {
    const classId = params.id;

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
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 text-center">
                <h2 className="text-2xl font-bold">Class with ID {classId} not found.</h2>
            </div>
        );
    }

    type UserAverage = {
        userId: string;
        averageScore: number;
    };

    type TopicLeaderboard = {
        topicId: string;
        topicName: string;
        leaderboard: UserAverage[];
    };

    const topicLeaderboards: TopicLeaderboard[] = [];

    for (const doc of adminClass.documents) {
        for (const topic of doc.topics) {
            const userScoresMap: Record<string, number[]> = {};

            for (const score of topic.scores) {
                if (!userScoresMap[score.userId]) {
                    userScoresMap[score.userId] = [];
                }
                userScoresMap[score.userId].push(score.score);
            }

            const userAverages: UserAverage[] = [];

            for (const userId in userScoresMap) {
                const scores = userScoresMap[userId];
                const avg = +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
                userAverages.push({ userId, averageScore: avg });
            }

            userAverages.sort((a, b) => b.averageScore - a.averageScore);

            topicLeaderboards.push({
                topicId: topic.id,
                topicName: topic.topicName,
                leaderboard: userAverages,
            });
        }
    }

    return (
        <main className="max-w-6xl mx-auto px-2 py-10 space-y-12">
            <section>
                <h1 className="text-4xl font-extrabold text-center text-black mb-2">
                    {adminClass.className}
                </h1>
                {adminClass.description && (
                    <p className="text-gray-600 mt-2 text-center text-lg italic max-w-2xl mx-auto">
                        {adminClass.description}
                    </p>
                )}
            </section>

            <section>
                <Card className="rounded-2xl border border-gray-300 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl text-gray-800 font-bold">Documents Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gradient-to-r from-blue-50 to-purple-100">
                                    <TableHead className="text-gray-700 font-semibold">Document Name</TableHead>
                                    <TableHead className="text-gray-700 font-semibold"># of Topics</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminClass.documents.map((doc: any, idx: number) => (
                                    <TableRow key={doc.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-purple-50 transition-colors duration-200"}>
                                        <TableCell className="text-gray-900 font-medium">{doc.name}</TableCell>
                                        <TableCell className="text-gray-900">{doc.topics.length}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </section>

            <section>
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Topic Leaderboards</h2>
                {topicLeaderboards.length === 0 ? (
                    <p className="text-gray-600 mt-2 text-center">No topics or scores found.</p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {topicLeaderboards.map(({ topicId, topicName, leaderboard }) => (
                            <Card key={topicId} className="rounded-2xl border border-gray-300 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-2xl">
                                    <CardTitle className="text-xl text-slate-700 font-semibold text-center">{topicName}</CardTitle>
                                </CardHeader>
                                <CardContent className="px-0">
                                    {leaderboard.length === 0 ? (
                                        <p className="text-sm text-gray-600 px-4 text-center">No scores yet.</p>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-100">
                                                    <TableHead className="text-gray-700">Rank</TableHead>
                                                    <TableHead className="text-gray-700">User ID</TableHead>
                                                    <TableHead className="text-gray-700">Average Score</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {leaderboard.map((entry, index) => (
                                                    <TableRow key={entry.userId + index} className={index === 0 ? "bg-yellow-50 font-bold" : index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                        <TableCell className="text-gray-900">{index + 1}</TableCell>
                                                        <TableCell className="text-gray-900">{entry.userId}</TableCell>
                                                        <TableCell className="text-gray-900">{entry.averageScore}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
