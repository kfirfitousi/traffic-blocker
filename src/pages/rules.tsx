import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { trpc } from "@/utils/trpc";
import { RuleCard } from "@/components/rule-card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { AddRule } from "@/components/add-rule";

const Rules: NextPage = () => {
  const rules = trpc.rulesRouter.getAll.useQuery();

  const addRuleMutation = trpc.rulesRouter.add.useMutation({
    onSuccess: () => rules.refetch(),
  });

  const deleteRuleMutation = trpc.rulesRouter.delete.useMutation({
    onSuccess: (rule) => {
      rules.refetch();
      toast({
        title: "Rule deleted",
        description: `Rule "${rule.name}" has been removed from all computers and deleted.`,
        action: (
          <ToastAction
            altText="Undo delete"
            onClick={() => addRuleMutation.mutate(rule)}
          >
            Undo
          </ToastAction>
        ),
      });
    },
  });

  return (
    <>
      <Head>
        <title>Traffic Blocker | Rules</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid min-h-screen grid-rows-[4rem,1fr] bg-slate-200 font-sans">
        <header className="flex items-center bg-slate-300 p-8">
          <nav className="flex w-full flex-row items-center gap-4 text-slate-700">
            <h1 className="text-2xl">Traffic Blocker</h1>
            <Link href="/">Computers</Link>
            <Link href="/rules">Rules</Link>
            <AddRule refetch={rules.refetch} />
          </nav>
        </header>

        <div className="row-span-3 flex flex-col gap-4 p-8">
          {rules.data?.map((rule) => (
            <div key={rule.id} className="flex flex-row gap-2">
              <RuleCard
                rule={rule}
                refetch={rules.refetch}
                trigger={
                  <div className="grid h-fit w-full cursor-pointer grid-cols-[1fr,1fr,1fr,3rem] rounded border border-slate-400 hover:bg-slate-300">
                    <div className="flex flex-col p-4">
                      <h2 className="text-lg text-slate-700">{rule.name}</h2>
                      <p className="text-slate-500">
                        Assigned to {rule.computers.length} computer
                        {rule.computers.length !== 1 && "s"}
                      </p>
                    </div>
                    <div className="flex flex-col p-4">
                      <p className="text-slate-700">Domains</p>
                      <p className="overflow-hidden text-ellipsis text-slate-500">
                        {rule.domains || "None"}
                      </p>
                    </div>
                    <div className="flex flex-col p-4">
                      <p className="text-slate-700">Ports</p>
                      <p className="overflow-hidden text-ellipsis text-slate-500">
                        {rule.ports || "None"}
                      </p>
                    </div>
                  </div>
                }
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="lg" className="h-full">
                    <X className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to remove the rule &quot;{rule.name}&quot;
                      from all computers and delete it.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteRuleMutation.mutate({ id: rule.id })}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Rules;
