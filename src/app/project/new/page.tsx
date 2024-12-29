import NewProjectForm from "@/app/_components/new-project-form";
import { TypographyH4 } from "@/ui/typography";

export default async function NewProject() {
  return (
    <div className="flex min-h-screen flex-col">
      <TypographyH4>New Board</TypographyH4>
      <section className="max-w-96 pt-4">
        <NewProjectForm />
      </section>
    </div>
  );
}
