import { cn } from "@/lib/utils";
import { DialogClose } from "@/ui/dialog";
import { Input } from "@/ui/input";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDebounce } from "@uidotdev/usehooks";
import * as LucideIcons from "lucide-react";
import { CSSProperties, ReactNode, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const ChevronsUpDown = LucideIcons.ChevronsUpDown;
const ITEM_SIZE = 40; // Size of each icon button
const CONTAINER_WIDTH = 445; // Approximate width of the container
const ITEMS_PER_ROW = Math.floor(CONTAINER_WIDTH / ITEM_SIZE);

const iconsToBePicked = Object.entries(LucideIcons.icons).map(([name]) => {
  return {
    value: name,
  };
});

const DialogIcon = ({
  children,
  onClick,
  isSelected,
  style,
}: {
  children: ReactNode;
  onClick: () => void;
  isSelected: boolean;
  style?: CSSProperties;
}) => {
  return (
    <span
      onClick={onClick}
      style={style}
      className={cn(
        "flex items-center justify-center rounded-md border border-input bg-background p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected && "border-2 border-ring bg-accent text-accent-foreground",
      )}
    >
      {children}
    </span>
  );
};

const IconPicker = ({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value?: string;
}) => {
  const [search, setSearch] = useState("");
  const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const filteredIcons = useMemo(
    () =>
      iconsToBePicked.filter((icon) =>
        icon.value.toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    [debouncedSearch],
  );

  const rowVirtualizer = useVirtualizer({
    count: filteredIcons.length,
    getScrollElement: () => parentRef,
    estimateSize: () => ITEM_SIZE,
    overscan: 50,
    lanes: ITEMS_PER_ROW,
  });

  return (
    <Dialog>
      <DialogTrigger
        role="combobox"
        className="inline-flex h-10 w-[200px] items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        <span className="overflow-hidden text-ellipsis">
          {value ? value : "Select Icon..."}
        </span>

        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose icon</DialogTitle>
          <DialogDescription>
            Please select the icon you want to choose for this project
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              placeholder="Enter icon name"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </div>
        </div>

        <div
          ref={setParentRef}
          className="h-72 overflow-y-auto rounded-md border bg-zinc-900"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
            className="relative w-full"
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const icon = filteredIcons[virtualItem.index];

              if (!icon) return null;

              const Icon =
                LucideIcons.icons[icon.value as keyof typeof LucideIcons.icons];

              if (!Icon) return null;

              const isSelected = value === icon.value;

              const row = Math.floor(virtualItem.index / ITEMS_PER_ROW);
              const column = virtualItem.index % ITEMS_PER_ROW;

              return (
                <DialogClose key={icon.value}>
                  <DialogIcon
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: `${ITEM_SIZE}px`,
                      height: `${ITEM_SIZE}px`,
                      transform: `translateY(${row * ITEM_SIZE}px) translateX(${column * ITEM_SIZE}px)`,
                    }}
                    isSelected={isSelected}
                    onClick={() => onChange(icon.value)}
                  >
                    <Icon />
                  </DialogIcon>
                </DialogClose>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IconPicker;
