import { type Task } from "@/server/db/types";
import { TypographyPSmall } from "@/ui/typography";

const ColumnTask = ({ task }: { task: Task }) => {
  return (
    <li
      key={task.id}
      className="dark:shadow-task-shadow w-full rounded-lg bg-[#22272B] px-3 py-2 dark:bg-white"
    >
      <TypographyPSmall>{task.name}</TypographyPSmall>
    </li>
  );
};

export default ColumnTask;
