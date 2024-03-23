import Columns from "@/app/_components/columns";
import { api } from "@/trpc/server";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Project({ params }: { params: { id: string } }) {
  noStore();

  const columns = await api.column.getByProjectId.query({
    projectId: params.id,
  });

  if (!columns) return redirect("/");

  return <Columns columns={columns} />;
}
