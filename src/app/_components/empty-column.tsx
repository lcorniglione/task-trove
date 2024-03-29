"use client";

import { columnFormSchema } from "@/lib/types";
import { type ColumnWithTasks } from "@/server/db/types";
import { api } from "@/trpc/react";
import { Button } from "@/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/ui/form";
import { Input } from "@/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useParams } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EmptyColumnProps {
  isEmptyBoard: boolean;
  listRef: RefObject<HTMLUListElement>;
}

const EmptyColumn = ({ isEmptyBoard, listRef }: EmptyColumnProps) => {
  const params = useParams<{ id: string }>();
  const [addingColumn, setAddingColumn] = useState(isEmptyBoard);
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof columnFormSchema>>({
    resolver: zodResolver(columnFormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const ctx = api.useUtils();
  const { mutate: createColumn } = api.column.create.useMutation({
    onMutate: async (newColumn) => {
      form.reset();

      await ctx.column.getByProjectId.cancel();

      const prevData = ctx.column.getByProjectId.getData();

      const newColumnExtraFields: ColumnWithTasks = {
        ...newColumn,
        id: Math.random(),
        tasks: [],
        createdAt: new Date(),
        positionInsideProject: 1,
        updatedAt: null,
      };

      ctx.column.getByProjectId.setData({ projectId: params.id }, (old) => [
        ...(old ? old : []),
        newColumnExtraFields,
      ]);

      return { prevData };
    },
    onSettled() {
      void ctx.column.getByProjectId.invalidate({ projectId: params.id });
    },
    onSuccess() {
      listRef.current?.scroll({
        left: listRef.current?.scrollWidth,
        behavior: "smooth",
      });
    },
  });

  const handleAddColumnClick = () => {
    flushSync(() => {
      setAddingColumn(true);
    });

    inputRef.current?.focus();
  };

  const handleCancelAddColumnClick = () => {
    setAddingColumn(false);
  };

  const onSubmit = (values: z.infer<typeof columnFormSchema>) => {
    createColumn({ name: values.name, projectId: parseInt(params.id) });
  };

  return (
    <li className="flex min-w-[350px] flex-col">
      {!addingColumn ? (
        <button
          className="w-full rounded-lg bg-slate-400 bg-opacity-20 p-4 text-left"
          onClick={handleAddColumnClick}
        >
          + Add new column
        </button>
      ) : (
        <div className="w-full rounded-lg bg-black text-white  dark:bg-[#f1f2f4] dark:text-black">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <section className="p-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          ref={inputRef}
                          placeholder="Enter column name"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </section>

              <section className="flex p-4 align-middle">
                <Button variant="default" size="sm" type="submit">
                  Apply
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelAddColumnClick}
                >
                  <X />
                </Button>
              </section>
            </form>
          </Form>
        </div>
      )}
    </li>
  );
};

export default EmptyColumn;
