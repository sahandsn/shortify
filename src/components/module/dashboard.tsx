"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import { Pagination } from "../common/pagination";
import { H1 } from "../ui/typography";
import { UrlView } from "../common/url-view";
import { UrlCreate } from "../common/url-create";
import { Input } from "../common/input";
import { Search } from "lucide-react";
import { useDebouncedValue } from "@mantine/hooks";

export function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [val, setVal] = useState("");

  const [debouncedVal] = useDebouncedValue(val, 1000);
  const [allUrl] = api.url.getAllPaginated.useSuspenseQuery({
    page: currentPage,
    query: debouncedVal,
  });
  return (
    <main className="space-y-8">
      <H1>Dashboard</H1>
      <section className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap">
        <Input
          className="sm:max-w-[300px]"
          placeholder="Search"
          startIcon={Search}
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <section className="flex items-center gap-2">
          <UrlCreate />
        </section>
      </section>
      {allUrl.items.length > 0 ? (
        <section className="space-y-8">
          <section className="flex grid-cols-2 flex-col gap-4 md:grid">
            {allUrl.items.map((item) => (
              <UrlView {...item} key={item.id} />
            ))}
          </section>
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={allUrl.pagination.totalPages}
          />
        </section>
      ) : (
        <p>Add a url first.</p>
      )}
    </main>
  );
}
