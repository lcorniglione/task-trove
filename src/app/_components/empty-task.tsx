"use client";

import { taskFormSchema } from "@/lib/types";
import { type Task } from "@/server/db/types";
import { api } from "@/trpc/react";
import { Button } from "@/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/ui/form";
import { Input } from "@/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { forwardRef, useEffect, useRef, type RefObject } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

interface EmptyTaskProps {
  onCancel: () => void;
  columnId: number;
  listRef: RefObject<HTMLUListElement>;
}

const EmptyTask = forwardRef<HTMLFormElement, EmptyTaskProps>(
  ({ onCancel, columnId, listRef }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof taskFormSchema>>({
      resolver: zodResolver(taskFormSchema),
      defaultValues: {
        name: "",
      },
    });

    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    const ctx = api.useUtils();
    const { mutate: createTask } = api.task.create.useMutation({
      onMutate: async (newTask) => {
        form.reset();

        await ctx.task.getByColumnId.cancel({ columnId });

        const prevData = ctx.task.getByColumnId.getData({ columnId });

        if (!prevData) return { prevData };

        const fullTask: Task = {
          ...newTask,
          id: Math.random(),
          createdAt: new Date(),
          positionInsideColumn: prevData.length,
          updatedAt: null,
        };

        ctx.task.getByColumnId.setData({ columnId }, (old) => [
          ...(old ? old : []),
          fullTask,
        ]);

        return { prevData };
      },
      onSettled() {
        void ctx.task.getByColumnId.invalidate({ columnId });
      },
      onSuccess() {
        listRef.current?.scroll({
          top: listRef.current?.scrollHeight,
          behavior: "smooth",
        });
      },
    });

    const onSubmit = (values: z.infer<typeof taskFormSchema>) => {
      const tasksOnColumn = ctx.task.getByColumnId.getData({ columnId });
      createTask({
        name: values.name,
        columnId,
        positionInsideColumn: tasksOnColumn?.length ?? 0,
      });
    };

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full"
          ref={ref}
        >
          <section className="flex flex-col gap-2 p-2">
            <div className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-secondary-foreground">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        ref={inputRef}
                        placeholder="Enter task title"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="flex justify-between p-2">
            <Button variant="ghost" type="submit">
              <Plus className="mr-2 h-4 w-4" /> Save Task
            </Button>

            <Button variant="ghost" onClick={onCancel}>
              <X />
            </Button>
          </section>
        </form>
      </Form>
    );
  },
);

EmptyTask.displayName = "EmptyTask";

export default EmptyTask;
