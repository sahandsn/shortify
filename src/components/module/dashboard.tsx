"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import { Pagination } from "../common/pagination";
import { H1, List } from "../ui/typography";
import { UrlView } from "../common/url-view";

export function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [allUrl] = api.url.getAllPaginated.useSuspenseQuery({
    page: currentPage,
  });
  return (
    <main>
      <H1>Dashboard</H1>
      <List>
        {allUrl.items.map((item) => (
          <UrlView {...item} key={item.id} />
        ))}
      </List>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={allUrl.pagination.totalPages}
      />
    </main>
  );
}
