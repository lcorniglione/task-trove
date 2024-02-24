import EmptyColumn from "@/app/_components/empty-column";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Project({ params }: { params: { id: string } }) {
  // noStore();

  const project = await api.project.geyById.query({ id: params.id });

  if (!project) return redirect("/");

  return (
    <ol className="flex gap-4 p-4">
      {project.columns.map((column) => (
        <li key={column.id} className="flex h-[100vh] w-[350px] flex-col">
          <div className="w-full rounded-lg bg-[#033431]">
            <section className="p-2">
              <h1 className="text-white">{column.name}</h1>
            </section>

            <ol className="p-4">
              {column.tasks.map((task) => (
                <li
                  key={task.id}
                  className="w-full rounded-lg bg-[#22272b] p-4 text-white"
                >
                  {task.name}
                </li>
              ))}
            </ol>

            <section>footer</section>
          </div>
        </li>
      ))}

      <EmptyColumn />
    </ol>
  );
}
