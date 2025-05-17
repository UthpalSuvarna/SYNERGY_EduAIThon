import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { subjects } from "../../lib/data"
import { prisma } from "@/lib/prisma-edge"
import { auth } from "@/auth"
import UploadDocument from "./upload"

export default async function SubjectPage({ params }: { params: { id: string } }) {
  const session = await auth();

  const classInfo = await prisma.adminClass.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      className: true,
      adminEmail: true,
      description: true,
    },
  });

  const classDocuments = await prisma.documents.findMany({
    where: {
      classId: params.id
    }
  })

  if (!classInfo) {
    notFound();
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
            {session?.user?.email === classInfo.adminEmail && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Admin Actions</h2>
                <div className="space-y-2">
                  <div className="bg-slate-400 rounded-2xl p-4">
                    <UploadDocument ClassId={classInfo.id.toString()} />
                  </div>
                  <Button variant="destructive" className="w-full">
                    Delete Class
                  </Button>
                </div>
              </div>
            )}
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

      <div className="pt-3">
        {classDocuments.map((document: any) => (
          <div key={document.id} className="border p-4 rounded mb-4">
            <h3 className="text-lg font-semibold">{document.name.toUpperCase()}</h3>
            <p className="text-gray-700">Uploaded on {new Date(document.createdAt).toLocaleDateString()} at {new Date(document.createdAt).toLocaleTimeString()}</p>
            <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              View Document
            </a>
            <a href={`/document/${document.id}`} className="text-blue-500 hover:underline p-3">View document info</a>
          </div>
        ))}
      </div>
    </div>
  );
}
