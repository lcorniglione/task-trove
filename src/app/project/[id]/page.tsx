import Columns from "@/app/_components/columns";
import ProjectName from "@/app/_components/project-name";
import { api } from "@/trpc/server";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Project({ params }: { params: { id: string } }) {
  noStore();

  const project = await api.project.geyById.query({
    id: params.id,
  });

  const columns = await api.column.getByProjectId.query({
    projectId: params.id,
  });

  if (!columns || !project) return redirect("/");

  return (
    <div className="flex min-h-0 flex-grow flex-col gap-6 pt-8">
      <ProjectName name={project.name} />
      <Columns columns={columns} />
    </div>
  );
}
