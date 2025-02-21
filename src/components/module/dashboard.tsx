"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import { Pagination } from "../common/pagination";
import { H1, List } from "../ui/typography";
import Link from "next/link";

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
          <Link href={item.destination} key={item.id} target="_blank">
            <li>{item.destination}</li>
          </Link>
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
