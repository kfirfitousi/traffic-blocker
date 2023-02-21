import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { RuleCard } from "@/components/rule-card";

const Rules: NextPage = () => {
  const rules = trpc.rulesRouter.getAll.useQuery({
    includeComputers: true,
  });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid min-h-screen grid-rows-[4rem,1fr] bg-slate-200 font-sans">
        <header className="row-span-1 flex items-center bg-slate-300 p-8">
          <nav className="flex flex-row items-center gap-4 text-slate-700">
            <h1 className="text-2xl">Traffic Blocker</h1>
            <Link href="/">Computers</Link>
            <Link href="/rules">Rules</Link>
          </nav>
        </header>

        <div className="row-span-3 flex flex-col gap-4 p-8">
          {rules.data?.map((rule) => (
            <RuleCard key={rule.id} rule={rule} refetch={rules.refetch} />
          ))}
        </div>
      </main>
    </>
  );
};

export default Rules;
