import Columns from "@/app/_components/columns";
import ProjectName from "@/app/_components/project-name";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Project(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const project = await api.project.geyById.query({
    id: params.id,
  });

  const columns = await api.column.getByProjectId.query({
    projectId: params.id,
  });

  if (!columns || !project) return redirect("/");

  return (
    <div className="flex min-h-0 flex-grow flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectName name={project.name} />
        <Columns columns={columns} />
      </Suspense>
    </div>
  );
}
