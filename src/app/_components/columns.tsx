"use client";

import Column from "@/app/_components/column";
import EmptyColumn from "@/app/_components/empty-column";
import { type ColumnWithTasks } from "@/server/db/types";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";

interface ColumnsProps {
  columns: ColumnWithTasks[];
}

const Columns = ({ columns }: ColumnsProps) => {
  const params = useParams<{ id: string }>();
  const { data: cols } = api.column.getByProjectId.useQuery(
    {
      projectId: params.id,
    },
    { initialData: columns },
  );

  return (
    <ol className="flex h-full gap-4 overflow-hidden">
      {cols.map((column) => (
        <Column key={column.id} column={column} />
      ))}

      <EmptyColumn isEmptyBoard={cols.length === 0} />
    </ol>
  );
};

export default Columns;
