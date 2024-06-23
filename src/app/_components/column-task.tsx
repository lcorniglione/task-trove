"use client";

import { type Task } from "@/server/db/types";
import { api } from "@/trpc/react";
import { Button } from "@/ui/button";
import { TypographyPSmall } from "@/ui/typography";
import { Trash } from "lucide-react";
import { useState } from "react";
import type { DragEvent } from "react";

const ColumnTask = ({ task }: { task: Task }) => {
  const [dropLocation, setDropLocation] = useState<"top" | "bottom" | null>(
    null,
  );

  const ctx = api.useUtils();
  const { mutate: deleteTask } = api.task.delete.useMutation({
    onMutate: async () => {
      await ctx.task.getByColumnId.cancel({ columnId: task.columnId });

      const prevData = ctx.task.getByColumnId.getData({
        columnId: task.columnId,
      });

      if (!prevData) return { prevData };

      const taskIndex = prevData.findIndex((t) => t.id === task.id);

      if (taskIndex === -1) return { prevData };

      prevData.splice(taskIndex, 1);

      ctx.task.getByColumnId.setData({ columnId: task.columnId }, () => [
        ...prevData,
      ]);

      return { prevData };
    },
    onSettled() {
      void ctx.task.getByColumnId.invalidate({ columnId: task.columnId });
    },
  });

  const { mutate: updateTask } = api.task.update.useMutation({
    onMutate: async (modifiedTask) => {
      await ctx.task.getByColumnId.cancel({ columnId: task.columnId });

      const prevData = ctx.task.getByColumnId.getData({
        columnId: task.columnId,
      });

      if (!prevData) return { prevData };

      const taskIndex = prevData.findIndex((t) => t.id === modifiedTask.id);
      if (taskIndex === -1) return { prevData };

      const prevTask = prevData[taskIndex];
      if (!prevTask) return { prevData };

      const fullTask = {
        ...prevTask,
        ...modifiedTask,
      };

      prevData.splice(taskIndex, 1, fullTask);

      const newArray = [...prevData].sort(
        (t1, t2) => t1.positionInsideColumn - t2.positionInsideColumn,
      );

      ctx.task.getByColumnId.setData(
        { columnId: task.columnId },
        () => newArray,
      );

      return { prevData };
    },
    onSettled() {
      void ctx.task.getByColumnId.invalidate({ columnId: task.columnId });
    },
  });

  const handleTaskDeletion = () => {
    deleteTask({ id: task.id });
  };

  const handleDragStart = (ev: DragEvent<HTMLLIElement>) => {
    ev.dataTransfer.setData(
      "application/drag",
      JSON.stringify({ taskId: task.id, columnId: task.columnId }),
    );

    ev.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (ev: DragEvent<HTMLLIElement>) => {
    const rect = ev.currentTarget.getBoundingClientRect();
    const mid = (rect.top + rect.bottom) / 2;

    setDropLocation(ev.clientY < mid ? "top" : "bottom");
  };

  const handleDrop = (ev: DragEvent<HTMLLIElement>) => {
    const data: { taskId: number; columnId: number } = JSON.parse(
      ev.dataTransfer.getData("application/drag"),
    );
    const droppedTaskId = data.taskId;
    if (!droppedTaskId) return;

    // If we are moving tasks across different columns
    if (task.columnId !== data.columnId) {
      setDropLocation(null);
      return;
    }

    const tasks = ctx.task.getByColumnId.getData({
      columnId: task.columnId,
    });

    if (!tasks) return;

    const targetTaskIndex = tasks.findIndex((t) => t.id === task.id);

    if (targetTaskIndex === -1) return;

    const previousTask = tasks[targetTaskIndex - 1];
    const nextTask = tasks[targetTaskIndex + 1];
    const previousTaskPosition = previousTask
      ? previousTask.positionInsideColumn
      : 0;
    const nextTaskPosition = nextTask
      ? nextTask.positionInsideColumn
      : task.positionInsideColumn + 1;

    const referenceTaskPosition =
      dropLocation === "top" ? previousTaskPosition : nextTaskPosition;
    const newPosition = (referenceTaskPosition + task.positionInsideColumn) / 2;

    updateTask({
      id: droppedTaskId,
      positionInsideColumn: newPosition,
    });

    setDropLocation(null);
  };

  const handleDragLeave = () => {
    setDropLocation(null);
  };

  return (
    <li
      id={`task-id-${task.id}`}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      className={`py-2 ${dropLocation === "top" ? "border-t border-t-red-100" : dropLocation === "bottom" ? "border-b border-b-red-100" : "border-b-0 border-t-0 border-b-transparent border-t-transparent"}`}
    >
      <div
        draggable={true}
        className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-[#22272B] px-3 py-2 dark:bg-white dark:shadow-task-shadow"
      >
        <TypographyPSmall>{task.name}</TypographyPSmall>

        <Button variant="ghost" size="icon" onClick={handleTaskDeletion}>
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </li>
  );
};

export default ColumnTask;
