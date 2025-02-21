import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function UrlPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const id = (await params).id;
  let url;

  try {
    url = await api.url.createAnalytics({ destination: id });
    console.log(url.source);
  } catch (error) {
    console.error(error);
    redirect("/not-found");
  }

  redirect(url.source);
}
