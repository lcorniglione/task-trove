import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Project({ params }: { params: { id: string } }) {
  // noStore();

  const project = await api.project.geyById.query({ id: params.id });

  if (!project) return redirect("/");

  return <div>{project.name}</div>;
}
