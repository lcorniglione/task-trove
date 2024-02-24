"use client";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { X } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { flushSync } from "react-dom";

const EmptyColumn = () => {
  const [addingColumn, setAddingColumn] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputText, setInputText] = useState("");

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
        <div className="w-full rounded-lg bg-[#033431]">
          <section className="p-2">
            <Input
              value={inputText}
              onChange={handleInputChange}
              ref={inputRef}
              placeholder="Enter column name"
            />
          </section>

          <section className="flex p-4 align-middle">
            <Button variant="default" size="sm">
              Apply
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelAddColumnClick}
            >
              <X color="white" />
            </Button>
          </section>
        </div>
      )}
    </li>
  );
};

export default EmptyColumn;
