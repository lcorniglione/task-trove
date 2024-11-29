import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import * as LucideIcons from "lucide-react";
import { useState } from "react";

const ChevronsUpDown = LucideIcons.ChevronsUpDown;

const iconsToBePicked = Object.entries(LucideIcons)
  .filter(([, Icon]) => {
    return Icon.displayName;
  })
  .map(([name, Icon]) => {
    return {
      value: name,
      label: name
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/^-/, ""),
    };
  });

const IconPicker2 = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Dialog>
      <DialogTrigger
        role="combobox"
        aria-expanded={open}
        className="inline-flex h-10 w-[200px] items-center justify-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
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
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
        </div>

        <ScrollArea className="grid h-72 w-[100%] grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-4 rounded-md border">
          {iconsToBePicked.map((icon) => {
            const Icon = LucideIcons.icons[icon.value];

            if (!Icon) return null;

            return <Icon className="h-4 w-4" />;
          })}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default IconPicker2;
