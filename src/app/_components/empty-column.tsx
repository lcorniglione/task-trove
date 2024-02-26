"use client";

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

  const utils = api.useUtils();
  const {} = api.project.geyById.useQuery({ id: params.id });
  const createColumn = api.column.create.useMutation({
    async onMutate(newColumn) {
      await utils.project.geyById.cancel();

      // Get the data from the queryCache
      const prevData = utils.project.geyById.getData({ id: params.id });

      // Optimistically update the data with our new post
      utils.project.geyById.setData({ id: params.id }, (old) => {
        return {
          ...old,
          columns: [...old?.columns, { id: "fake", ...newColumn }],
        };
      });

      setAddingColumn(false);

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError(err, newPost, ctx) {
      // If the mutation fails, use the context-value from onMutate
      utils.project.geyById.setData({ id: params.id }, ctx.prevData);
    },
    onSettled() {
      // Sync with server once mutation has settled
      utils.project.geyById.invalidate();
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
    createColumn.mutate({ name: inputText, projectId: parseInt(params.id) });
  };

  return (
    <li className="flex h-[100vh] w-[350px] flex-col">
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
