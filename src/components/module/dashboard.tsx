"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import { Pagination } from "../common/pagination";
import { H1 } from "../ui/typography";
import { UrlView } from "../common/url-view";

export function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [allUrl] = api.url.getAllPaginated.useSuspenseQuery({
    page: currentPage,
  });
  return (
    <main className="space-y-8">
      <H1>Dashboard</H1>
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
