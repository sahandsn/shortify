import Link from "next/link";
import { H1, P } from "../ui/typography";
import { buttonVariants } from "../ui/button";
import { Link as LinkIcon } from "lucide-react";
import Image from "next/image";

export function Home() {
  return (
    <main className="flex flex-col items-center gap-8 pt-[15%]">
      <section className="text-center">
        <H1>Enhance Your Link Management</H1>
        <P>
          Shortify is an open-source platform that allows you to create, manage,
          and share short links with ease. It is fast, secure, and easy to use.
        </P>
      </section>
      <section className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/dashboard"
          className={buttonVariants({
            variant: "default",
            size: "lg",
          })}
        >
          <LinkIcon size={18} className="duration-300" />
          <span>Create a Link</span>
        </Link>

        <Link
          href="https://github.com/sahandsn/shortify"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
          })}
        >
          <Image alt="github" src="/github.svg" width={20} height={20} />
          <span>Star on GitHub</span>
        </Link>
      </section>
    </main>
  );
}
