"use client";

import { projectNameFormSchema } from "@/lib/types";
import { api } from "@/trpc/react";
import { Button } from "@/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/ui/form";
import { Input } from "@/ui/input";
import { TypographyH4 } from "@/ui/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClickAway } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ProjectNameProps {
  name: string;
}

const ProjectName = ({ name }: ProjectNameProps) => {
  const [editingName, setEditionName] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof projectNameFormSchema>>({
    resolver: zodResolver(projectNameFormSchema),
    defaultValues: {
      name: name,
    },
  });

  const { mutate: updateProject } = api.project.update.useMutation({
    onMutate: async () => {
      form.reset();
      setEditionName(false);
    },

    onSuccess() {
      router.refresh();
    },
  });

  const editName = () => {
    flushSync(() => {
      setEditionName(true);
    });

    inputRef.current?.focus();
    inputRef.current?.select();
  };

  const onSubmit = (values: z.infer<typeof projectNameFormSchema>) => {
    updateProject(values);
  };

  const ref = useClickAway<HTMLDivElement>(() => {
    setEditionName(false);
  });

  if (editingName) {
    return (
      <div className="ml-8 self-start" ref={ref}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      ref={inputRef}
                      placeholder="Enter project name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    );
  }

  return (
    <Button variant="ghost" className="ml-8 self-start" onClick={editName}>
      <TypographyH4>{name}</TypographyH4>
    </Button>
  );
};

export default ProjectName;
