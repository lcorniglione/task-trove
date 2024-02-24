import { api } from "@/trpc/server";
import { Card, CardHeader, CardTitle } from "@/ui/card";
import Link from "next/link";

export default async function Home() {
  // noStore();

  const projects = await api.project.getAll.query();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        {projects.map((project) => (
          <Link key={project.id} href={`project/${project.id}`} prefetch={true}>
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
