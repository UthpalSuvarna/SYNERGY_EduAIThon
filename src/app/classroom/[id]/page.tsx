import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { subjects } from "../../lib/data"
import { prisma } from "@/lib/prisma-edge"

export default async function SubjectPage({ params }: { params: { id: string } }) {
  const paramId = params.id
  const classInfo = await prisma.adminClass.findUnique(
    {
      where: {
        id: paramId,
      },
      select: {
        id: true,
        className: true,
        adminEmail: true,
        description: true

      },
    }
  )

  if (!classInfo) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <Link href="/classroom">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Classroom
        </Button>
      </Link>

      <Card className="border-t-4">
        <CardHeader>
          <CardTitle className="text-3xl">{classInfo.className}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Course Description</h2>
            <p className="text-gray-700">{classInfo.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
            <div className="flex items-center text-gray-700">
              <Mail className="mr-2 h-4 w-4" />
              <a href={`mailto:${classInfo.adminEmail}`} className="hover:underline">
                {classInfo.adminEmail}
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
