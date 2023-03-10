import { type NextPage } from "next";
import Head from "next/head";
import { X } from "lucide-react";

import { trpc } from "@/utils/trpc";
import { toast } from "@/hooks/use-toast";
import { AddComputer } from "@/components/add-computer";
import { Button } from "@/components/ui/button";
import { ComputerCard } from "@/components/computer-card";
import { Header } from "@/components/header";
import { ToastAction } from "@/components/ui/toast";
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

const Home: NextPage = () => {
  const computers = trpc.computersRouter.getAll.useQuery();

  const addComputerMutation = trpc.computersRouter.add.useMutation({
    onSuccess: () => computers.refetch(),
  });

  const deleteComputerMutation = trpc.computersRouter.delete.useMutation({
    onSuccess: (computer) => {
      computers.refetch();
      toast({
        title: "Computer deleted",
        description: `${computer.hostname} has been deleted.`,
        action: (
          <ToastAction
            altText="Undo"
            onClick={() => {
              addComputerMutation.mutate(computer);
            }}
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
        <title>Traffic Blocker | Computers</title>
        <meta name="description" content="Generated by create-t3-app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid min-h-screen grid-rows-[4rem,1fr] bg-slate-200 font-sans">
        <Header action={<AddComputer refetch={computers.refetch} />} />
        <div className="flex flex-row flex-wrap content-start gap-4 p-8">
          {computers.isLoading && <p>Loading...</p>}
          {computers.data?.map((computer) => (
            <div key={computer.macAddress} className="relative">
              <ComputerCard
                key={computer.macAddress}
                computer={computer}
                refetch={computers.refetch}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-1 right-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to delete the computer &quot;
                      {computer.hostname}&quot;.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        deleteComputerMutation.mutate({
                          macAddress: computer.macAddress,
                        });
                      }}
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

export default Home;
