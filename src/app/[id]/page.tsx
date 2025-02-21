import { api } from "@/trpc/server";

export default async function UrlPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const id = (await params).id;
  try {
    const url = await api.url.createAnalytics({ destination: id });

    return <main>My Post: {url.source}</main>;
  } catch (error) {
    console.error(error);
    return <main>Not found.</main>;
  }
}
