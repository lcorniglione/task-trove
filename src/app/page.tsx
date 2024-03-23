import { api } from "@/trpc/server";
import { Card, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  noStore();

  const projects = await api.project.getAll.query();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="gap-12px-4 container flex items-center justify-center py-16">
        {projects.map((project) => (
          <Link key={project.id} href={`project/${project.id}`} prefetch={true}>
            <Card className="w-[350px]">
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
