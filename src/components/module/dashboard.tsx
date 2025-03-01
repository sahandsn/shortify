"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import { Pagination } from "../common/pagination";
import { H1 } from "../ui/typography";
import { UrlView } from "../common/url-view";
import { UrlCreate } from "../common/url-create";
import { Input } from "../common/input";
import { Package, Search } from "lucide-react";
import { useDebouncedCallback } from "@mantine/hooks";
import { Button } from "../ui/button";
import { MAX_URL_COUNT } from "@/assets";

export function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [val, setVal] = useState("");

  const handleSearch = useDebouncedCallback((query: string) => {
    setVal(query);
    setCurrentPage(1);
  }, 500);

  const [allUrl] = api.url.fetchUrls.useSuspenseQuery({
    page: currentPage,
    query: val,
  });
  const [count] = api.url.countUrl.useSuspenseQuery();

  return (
    <main className="space-y-8">
      <H1>Dashboard</H1>
      <section className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap">
        <Input
          className="sm:max-w-[300px]"
          placeholder="Search"
          startIcon={Search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <section className="flex items-center gap-2">
          <Button variant="secondary">
            <Package />
            {count}/{MAX_URL_COUNT}
          </Button>
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
        <p>Empty list</p>
      )}
    </main>
  );
}
