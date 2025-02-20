import {
  Pagination as PaginationNav,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "../ui/button";

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  setCurrentPage,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages = new Set<number>();
    // Always include first page
    pages.add(1);
    // Include previous page if valid
    if (currentPage > 1) pages.add(currentPage - 1);
    // Include current page
    pages.add(currentPage);
    // Include next page if valid
    if (currentPage < totalPages) pages.add(currentPage + 1);
    // Always include last page
    pages.add(totalPages);

    return Array.from(pages).sort((a, b) => a - b);
  };

  const renderPaginationItems = () => {
    const pageNumbers = getPageNumbers();
    const items: React.ReactNode[] = [];
    let previousPage: number | null = null;

    pageNumbers.forEach((page) => {
      // Add ellipsis if gap between current and previous page
      if (previousPage !== null && page - previousPage > 1) {
        items.push(
          <PaginationItem key={`ellipsis-${previousPage}`}>
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      // Add page number
      items.push(
        <PaginationItem key={page}>
          <Button
            variant={currentPage === page ? "outline" : "ghost"}
            size={"icon"}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        </PaginationItem>,
      );

      previousPage = page;
    });

    return items;
  };

  return (
    <PaginationNav>
      <PaginationContent>{renderPaginationItems()}</PaginationContent>
    </PaginationNav>
  );
};
