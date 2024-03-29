"use client";

import { taskFormSchema } from "@/lib/types";
import { Task } from "@/server/db/types";
import { api } from "@/trpc/react";
import { Button } from "@/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/ui/form";
import { Input } from "@/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { forwardRef, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EmptyTaskProps {
  onCancel: () => void;
  columnId: number;
}

const EmptyTask = forwardRef<HTMLLIElement, EmptyTaskProps>(
  ({ onCancel, columnId }, ref) => {
    const params = useParams<{ id: string }>();
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
          author: "me",
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
    });

    const onSubmit = (values: z.infer<typeof taskFormSchema>) => {
      createTask({ name: values.name, columnId: parseInt(params.id) });
    };

    return (
      <>
        <section ref={ref} className="flex flex-col gap-2 p-2">
          <div className="flex w-full items-center justify-between rounded-lg bg-[#22272B] px-3 py-2 dark:bg-white dark:shadow-task-shadow">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
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
              </form>
            </Form>
          </div>
        </section>

        <section className="flex justify-between p-2">
          <Button variant="ghost">
            <Plus className="mr-2 h-4 w-4" /> Save Task
          </Button>

          <Button variant="ghost" onClick={onCancel}>
            <X />
          </Button>
        </section>
      </>
    );
  },
);

EmptyTask.displayName = "EmptyTask";

export default EmptyTask;
