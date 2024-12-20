"use client";

import { projectFormSchema } from "@/lib/types";
import { isTRPCClientError } from "@/trpc/helpers";
import { api } from "@/trpc/react";
import { Button } from "@/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import IconPicker from "@/ui/icon-picker";
import { Input } from "@/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const NewProjectForm = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const utils = api.useUtils();
  const { mutate: createProject, isPending } = api.project.create.useMutation({
    onSuccess: ([data]) => {
      void utils.project.invalidate();
      router.push(`/project/${data?.insertedId}`);
    },
    onError: (error) => {
      if (isTRPCClientError(error)) {
        toast.error(
          `Something went wrong: ${error.data?.httpStatus}: ${JSON.stringify(
            error.data?.zodError?.fieldErrors,
          )}`,
        );
      } else {
        toast.error(`Something went wrong: ${error.message}`);
      }
    },
  });

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
    },
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = (values: z.infer<typeof projectFormSchema>) => {
    createProject(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-end gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  ref={inputRef}
                  placeholder="Enter project name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter project description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <div className="w-full">
                  <IconPicker {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button
            variant="default"
            size="sm"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default NewProjectForm;
