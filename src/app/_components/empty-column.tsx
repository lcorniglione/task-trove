"use client";

import { type ColumnWithTasks } from "@/server/db/types";
import { api } from "@/trpc/react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { X } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState, type ChangeEvent } from "react";
import { flushSync } from "react-dom";

const EmptyColumn = () => {
  const params = useParams<{ id: string }>();
  const [addingColumn, setAddingColumn] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputText, setInputText] = useState("");

  const ctx = api.useUtils();
  const { mutate: createColumn } = api.column.create.useMutation({
    onMutate: async (newColumn) => {
      setInputText("");

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.currentTarget.value);
  };

  const onSubmit = () => {
    createColumn({ name: inputText, projectId: parseInt(params.id) });
  };

  return (
    <li className="flex h-[100vh] min-w-[350px] flex-col">
      {!addingColumn ? (
        <button
          className="w-full rounded-lg bg-slate-400 bg-opacity-20 p-4 text-left"
          onClick={handleAddColumnClick}
        >
          + Add new column
        </button>
      ) : (
        <div className="w-full rounded-lg bg-black text-white  dark:bg-[#f1f2f4] dark:text-black">
          <section className="p-2">
            <Input
              value={inputText}
              onChange={handleInputChange}
              ref={inputRef}
              placeholder="Enter column name"
            />
          </section>

          <section className="flex p-4 align-middle">
            <Button variant="default" size="sm" onClick={onSubmit}>
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
        </div>
      )}
    </li>
  );
};

export default EmptyColumn;
