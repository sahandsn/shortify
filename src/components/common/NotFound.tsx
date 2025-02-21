import { H1 } from "@/components/ui/typography";
import { SearchX } from "lucide-react";

export function NotFound() {
  return (
    <main className="flex items-center justify-center">
      <SearchX size={200} />
      <H1>Requested Resource Not Found</H1>
    </main>
  );
}
