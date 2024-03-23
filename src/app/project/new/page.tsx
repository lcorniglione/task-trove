import NewProjectForm from "@/app/_components/new-project-form";
import { TypographyH4 } from "@/ui/typography";
import { unstable_noStore as noStore } from "next/cache";

export default async function NewProject() {
  noStore();

  return (
    <main className="container flex min-h-screen flex-col">
      <TypographyH4>New Board</TypographyH4>
      <section className=" max-w-96 pt-4">
        <NewProjectForm />
      </section>
    </main>
  );
}
