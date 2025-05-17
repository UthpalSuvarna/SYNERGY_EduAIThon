import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { subjects } from "@/lib/data"

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Classroom</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Link
            href={`/subjects/${subject.id}`}
            key={subject.id}
            className="block transition-transform hover:scale-105"
          >
            <Card className="h-full border-t-4" style={{ borderTopColor: subject.color }}>
              <CardHeader>
                <CardTitle>{subject.name}</CardTitle>
                <CardDescription>{subject.teacher}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{subject.description}</p>
              </CardContent>
              <CardFooter className="text-sm text-gray-500">
                <p>Teacher: {subject.email}</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
