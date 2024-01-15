import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import { ReleaseNewsletter } from "@/components/release-newsletter";
import { Sidebar } from "@/components/sidebar/sidebar";
import { getRelease } from "@/lib/get-release";
import { cn, container } from "@/lib/utils";
import fs from "fs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

interface Props {
  params: {
    slug: string;
  };
}

const getReleases = () => {
  const releases: string[] = [];

  fs.readdirSync("content/releases").forEach((f) => {
    releases.push(f.replace(".md", ""));
  });

  return releases;
};

export const generateStaticParams = async () => {
  return getReleases().map((release) => ({
    slug: release,
  }));
};

export default async function Page({ params: { slug } }: Props) {
  const releases = getReleases();

  if (releases.includes(slug) === false) return notFound();

  const page = await getRelease(slug);

  return (
    <Fragment>
      <Header variant="system" />
      <main className={cn(container, "lg:pl-5 lg:pr-8 flex gap-4")}>
        <Sidebar>
          <div className="flex flex-col border-t border-zinc-200 mt-4 pt-4">
            {releases
              .sort((a, b) => b.localeCompare(a))
              .map((release) => (
                <Link
                  key={release}
                  href={`/releases/${release}`}
                  className={cn(
                    "flex items-center text-sm h-8 text-zinc-600 hover:text-blue-500 transition-colors px-2",
                    release === slug && "text-blue-500"
                  )}
                >
                  Version {release}
                </Link>
              ))}
          </div>
        </Sidebar>
        <article className="w-full flex-1 py-12 max-w-3xl">
          <h1 className="text-4xl mt-0 mb-6 font-bold">
            {page?.frontmatter.title || "Page Not Found"}
          </h1>
          {page && page.content}
          <ReleaseNewsletter />
        </article>
      </main>
      <Footer />
    </Fragment>
  );
}
