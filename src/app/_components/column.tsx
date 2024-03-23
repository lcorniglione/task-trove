import ColumnTask from "@/app/_components/column-task";
import { type ColumnWithTasks } from "@/server/db/types";
import { TypographySmall } from "@/ui/typography";

const Column = ({ column }: { column: ColumnWithTasks }) => {
  return (
    <li key={column.id} className="flex h-[100vh] min-w-[350px] flex-col ">
      <div className="w-full rounded-lg bg-black text-white shadow-2xl dark:bg-[#f1f2f4] dark:text-black">
        <section className="p-2">
          <TypographySmall>{column.name}</TypographySmall>
        </section>

        <ol className="p-2">
          {column.tasks.map((task) => (
            <ColumnTask key={task.id} task={task} />
          ))}
        </ol>

        <section className="p-2">footer</section>
      </div>
    </li>
  );
};

export default Column;
