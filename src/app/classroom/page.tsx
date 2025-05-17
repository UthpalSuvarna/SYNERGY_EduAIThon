import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { subjects } from "../lib/data"
import { prisma } from "@/lib/prisma-edge";
import { auth } from "@/auth";

export default async function Home() {
  const sesssion = await auth();
  const classes = await prisma.adminClass.findMany();

  if (!sesssion) {
    return <>
      <p>Sign IN</p>
    </>
  }
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Classroom</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem : any) => (
          <Link
            href={`/classroom/${classItem.id}`}
            key={classItem.id}
            className="block transition-transform hover:scale-105"
          >
            <Card className="h-full border-t-4">
              <CardHeader>
                <CardTitle>{classItem.className}</CardTitle>
                <CardDescription>teacher</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{classItem.description}</p>
              </CardContent>
              <CardFooter className="text-sm text-gray-500">
                <p>Teacher: {classItem.adminEmail}</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
