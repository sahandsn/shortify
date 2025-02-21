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
import type { urlRouter } from "@/server/api/routers/url";
import type { inferRouterOutputs } from "@trpc/server";
import { Loader2, Trash2 } from "lucide-react";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

export function UrlDelete(
  url: Readonly<
    inferRouterOutputs<typeof urlRouter>["fetchUrls"]["items"][number]
  >,
) {
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = api.url.deleteUrl.useMutation({
    async onSuccess(response) {
      await Promise.all([
        utils.url.fetchUrls.invalidate(),
        utils.url.countUrl.invalidate(),
      ]);
      form.reset();
      toast.success(response.message);
      setOpen(false);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const form = useForm({
    defaultValues: {
      destination: "",
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete /{url.destination}</DialogTitle>
          <DialogDescription>
            This url will not be available any more. All related analytics will
            be deleted as well.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => mutate({ urlId: url.id }))}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Type{" "}
                    <span className="font-semibold">{url.destination}</span> to
                    confirm:
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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

              <Button
                type="submit"
                variant="destructive"
                disabled={
                  form.watch("destination") !== url.destination || isPending
                }
              >
                <Loader2
                  className={cn({
                    "animate-spin": isPending,
                    hidden: !isPending,
                  })}
                />
                Delete
              </Button>
            </section>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
