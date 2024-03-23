import { api } from "@/trpc/server";
import { Button } from "@/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  noStore();

  const projects = await api.project.getAll.query();

  return (
    <main className="container flex min-h-screen flex-col ">
      <div className="pb-6 pt-6">
        <Link href="project/new">
          <Button>New Board</Button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-4">
        {projects.map((project) => (
          <Link key={project.id} href={`project/${project.id}`} prefetch={true}>
            <Card className=" w-[350px]">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
