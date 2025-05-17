import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { subjects } from "@/lib/data"

export default function SubjectPage({ params }: { params: { id: string } }) {
  const subject = subjects.find((s) => s.id === params.id)

  if (!subject) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Classroom
        </Button>
      </Link>

      <Card className="border-t-4" style={{ borderTopColor: subject.color }}>
        <CardHeader>
          <CardTitle className="text-3xl">{subject.name}</CardTitle>
          <CardDescription className="text-lg">{subject.teacher}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Course Description</h2>
            <p className="text-gray-700">{subject.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
            <div className="flex items-center text-gray-700">
              <Mail className="mr-2 h-4 w-4" />
              <a href={`mailto:${subject.email}`} className="hover:underline">
                {subject.email}
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Upcoming Assignments</h2>
            <p className="text-gray-500 italic">No upcoming assignments</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Recent Announcements</h2>
            <p className="text-gray-500 italic">No recent announcements</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
