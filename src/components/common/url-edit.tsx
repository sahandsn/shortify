import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Settings } from "lucide-react";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { URL_DESCRIPTION_LENGTH } from "@/server/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { editGenericSchema } from "@/schema/url";
import type { z } from "zod";
import type { inferRouterOutputs } from "@trpc/server";
import type { urlRouter } from "@/server/api/routers/url";

export function UrlEdit(
  url: Readonly<
    inferRouterOutputs<typeof urlRouter>["getAllPaginated"]["items"][number]
  >,
) {
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = api.url.editGeneric.useMutation({
    async onSuccess(response) {
      await utils.url.getAllPaginated.invalidate();
      form.reset();
      toast.success(response.message);
      setOpen(false);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const form = useForm<z.infer<typeof editGenericSchema>>({
    resolver: zodResolver(editGenericSchema),
    defaultValues: {
      source: url.source,
      description: url.description ?? "",
      id: url.id,
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit /{url.destination}</DialogTitle>
          <DialogDescription>
            Editing url information will not effect its existing analytics.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutate(data))}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Input placeholder="https://" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="a short about this url..."
                      className="h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-sm">
                    {form.watch("description")?.length ?? 0}/
                    {URL_DESCRIPTION_LENGTH}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <section className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button
                  type="reset"
                  onClick={() => {
                    form.reset();
                    setOpen(false);
                  }}
                  variant="outline"
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" variant="default" disabled={isPending}>
                <Loader2
                  className={cn({
                    "animate-spin": isPending,
                    hidden: !isPending,
                  })}
                />
                Save
              </Button>
            </section>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
