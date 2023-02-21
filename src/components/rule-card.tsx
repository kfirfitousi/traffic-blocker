import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

import type { Computer, Rule } from "@prisma/client";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { X } from "lucide-react";

type RuleCardProps = {
  rule: Rule & {
    computers: Computer[];
  };
  refetch: () => void;
};

export function RuleCard({ rule, refetch }: RuleCardProps) {
  const { toast } = useToast();
  const { id, name, computers } = rule;

  const [domains, setDomains] = useState(rule.domains);
  const [ports, setPorts] = useState(rule.ports);

  const addRuleMutation = trpc.rulesRouter.add.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteRuleMutation = trpc.rulesRouter.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast({
        title: "Rule deleted",
        description: `Rule "${name}" has been removed from all computers and deleted.`,
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

  const updateRuleMutation = trpc.rulesRouter.update.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <div className="flex flex-row items-center gap-2">
      <Dialog
        onOpenChange={() => {
          setDomains((domains) => domains.replace(/,+$/, ""));
          updateRuleMutation.mutate({
            id,
            domains,
            ports,
          });
        }}
      >
        <DialogTrigger asChild>
          <div
            key={id}
            className="grid h-fit w-full cursor-pointer grid-cols-[1fr,1fr,1fr,3rem] rounded border border-slate-400 hover:bg-slate-300"
          >
            <div className="flex flex-col p-4">
              <h2 className="text-lg text-slate-700">{name}</h2>
              <p className="text-slate-500">
                Assigned to {computers.length} computer
                {computers.length !== 1 && "s"}
              </p>
            </div>
            <div className="flex flex-col p-4">
              <p className="text-slate-700">Domains</p>
              <p className="overflow-hidden text-ellipsis text-slate-500">
                {domains || "None"}
              </p>
            </div>
            <div className="flex flex-col p-4">
              <p className="text-slate-700">Ports</p>
              <p className="overflow-hidden text-ellipsis text-slate-500">
                {ports || "None"}
              </p>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Rule</DialogTitle>
            <DialogDescription>Block domains and ports.</DialogDescription>
          </DialogHeader>
          <div className="grid w-full gap-1.5">
            <Label>Domains</Label>
            {domains.split(",").map((domain, i) => (
              <div
                key={i}
                className="flex w-full flex-row items-center gap-2 rounded"
              >
                <Input
                  value={domain}
                  onChange={(e) => {
                    setDomains((domains) =>
                      domains
                        .split(",")
                        .map((domain, j) => (i === j ? e.target.value : domain))
                        .join(",")
                    );
                  }}
                  onBlur={() => {
                    setDomains((domains) =>
                      domains
                        .split(",")
                        .map((domain, j) => (i === j ? domain.trim() : domain))
                        .join(",")
                    );
                    updateRuleMutation.mutate({
                      id,
                      domains,
                    });
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={() => {
                    setDomains((domains) =>
                      domains
                        .split(",")
                        .filter((domain, j) => i !== j)
                        .join(",")
                    );
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
            <Button
              onClick={() => setDomains((domains) => domains + ",")}
              variant="subtle"
              size="sm"
            >
              Add domain
            </Button>
            <Label className="mt-2">Ports</Label>
            {ports.split(",").map((port, i) => (
              <div
                key={port}
                className="flex w-full flex-row items-center gap-2 rounded"
              >
                <Input
                  value={port}
                  onChange={(e) => {
                    setPorts((ports) =>
                      ports
                        .split(",")
                        .map((port, j) => (i === j ? e.target.value : port))
                        .join(",")
                    );
                  }}
                  onBlur={() => {
                    setPorts((ports) =>
                      ports
                        .split(",")
                        .map((port, j) => (i === j ? port.trim() : port))
                        .join(",")
                    );
                    updateRuleMutation.mutate({
                      id,
                      ports,
                    });
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={() => {
                    setPorts((ports) =>
                      ports
                        .split(",")
                        .filter((port, j) => i !== j)
                        .join(",")
                    );
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
            <Button
              onClick={() => setPorts((ports) => ports + ",")}
              variant="subtle"
              size="sm"
            >
              Add port
            </Button>
          </div>
          <DialogFooter>
            <DialogTrigger asChild>
              <Button variant="subtle">Done</Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="lg" className="h-full">
            <X className="h-5 w-5" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting this rule will remove it from all computers and delete
              it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteRuleMutation.mutate({ id })}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
