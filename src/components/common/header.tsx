import { TITLE } from "@/assets";
import { Link as LinkIcon } from "lucide-react";
import { H3 } from "../ui/typography";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { UserNav } from "./user-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <section className="wrapper flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LinkIcon />
          <H3>{TITLE}</H3>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Link href="https://github.com/sahandsn/shortify" target="_blank">
              <Image alt="github" src="/github.svg" width={20} height={20} />
            </Link>
          </Button>
          <UserNav />
        </div>
      </section>
    </header>
  );
}
