import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Input } from "@/ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import * as LucideIcons from "lucide-react";
import { ReactNode, useMemo, useState } from "react";

const ChevronsUpDown = LucideIcons.ChevronsUpDown;

const iconsToBePicked = Object.entries(LucideIcons)
  .filter(([name]) => {
    // Filter out the default export and helper functions
    return (
      name !== "default" && name !== "icons" && name !== "createLucideIcon"
    );
  })
  .map(([name]) => {
    return {
      value: name,
      lowerCaseValue: name.toLowerCase(),
      label: name
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/^-/, ""),
    };
  });

const DialogIcon = ({
  children,
  onClick,
  isSelected,
}: {
  children: ReactNode;
  onClick: () => void;
  isSelected: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected && "bg-accent text-accent-foreground ring-2 ring-ring",
      )}
    >
      {children}
    </button>
  );
};

const IconPicker = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  const filteredIcons = useMemo(
    () =>
      iconsToBePicked.filter((icon) =>
        icon.lowerCaseValue.includes(debouncedSearch),
      ),
    [debouncedSearch],
  );

  return (
    <Dialog>
      <DialogTrigger
        role="combobox"
        aria-expanded={open}
        className="inline-flex h-10 w-[200px] items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        {value
          ? iconsToBePicked.find((framework) => framework.value === value)
              ?.label
          : "Select Icon..."}
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
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
              value={search}
            />
          </div>
        </div>

        <div className="grid h-72 w-[100%] grid-cols-[repeat(auto-fill,minmax(64px,1fr))] place-items-center gap-4 overflow-hidden overflow-y-scroll rounded-md border bg-zinc-900 p-2">
          {filteredIcons.map((icon) => {
            const Icon =
              LucideIcons.icons[icon.value as keyof typeof LucideIcons.icons];

            if (!Icon) return null;

            const isSelected = value === icon.value;
            return (
              <DialogIcon
                key={icon.value}
                isSelected={isSelected}
                onClick={() => setValue(icon.value)}
              >
                <Icon />
              </DialogIcon>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IconPicker;
