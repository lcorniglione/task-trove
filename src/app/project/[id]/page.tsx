import Column from "@/app/_components/column";
import EmptyColumn from "@/app/_components/empty-column";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Project({ params }: { params: { id: string } }) {
  // noStore();

  const project = await api.project.geyById.query({ id: params.id });
  console.log("REVALIDATE", project);
  if (!project) return redirect("/");

  return (
    <ol className="flex gap-4 p-8">
      {project.columns.map((column) => (
        <Column key={column.id} column={column} />
      ))}

      <EmptyColumn />
    </ol>
  );
}
