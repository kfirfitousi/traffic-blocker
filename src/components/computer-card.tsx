import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { RulesCombobox } from "@/components/rules-combobox";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import type { Computer, Rule } from "@prisma/client";
import { RuleCard } from "@/components/rule-card";

type ComputerDialogProps = {
  computer: Computer & {
    rules: Rule[];
  };
  refetch: () => void;
};

export function ComputerCard({ computer, refetch }: ComputerDialogProps) {
  const { toast } = useToast();
  const { macAddress, hostname, ip, rules } = computer;

  const assignRuleMutation = trpc.computersRouter.assignRule.useMutation({
    onSuccess: () => refetch(),
  });

  const unassignRuleMutation = trpc.computersRouter.unassignRule.useMutation({
    onSuccess: (_, variables) => {
      refetch();
      toast({
        title: "Rule unassigned",
        description: `Rule "${
          rules.find((rule) => rule.id === variables.ruleId)?.name
        }" has been removed from ${hostname}.`,
        action: (
          <ToastAction
            altText="Undo"
            onClick={() => {
              assignRuleMutation.mutate({
                macAddress,
                ruleId: variables.ruleId,
              });
            }}
          >
            Undo
          </ToastAction>
        ),
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex h-64 w-64 cursor-pointer flex-col rounded border border-slate-400 p-4 hover:bg-slate-300">
          <div className="grid grid-cols-2">
            <p className="text-sm text-slate-700">HOSTNAME:</p>
            <div className="flex justify-end text-slate-800">{hostname}</div>
          </div>
          <div className="grid grid-cols-2">
            <p className="text-sm text-slate-700">MAC:</p>
            <div className="flex justify-end text-sm leading-5 text-slate-800">
              {macAddress}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <p className="text-sm text-slate-700">IP:</p>
            <div className="flex justify-end text-slate-800">{ip}</div>
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-slate-700">
              {rules.length > 0 ? "ACTIVE RULES:" : "NO ACTIVE RULES"}
            </p>
            <div className="flex flex-col items-start overflow-scroll text-clip pl-2 text-slate-800">
              {rules.slice(0, 4).map((rule) => (
                <p key={rule.id}>• {rule.name}</p>
              ))}
              {rules.length > 4 && (
                <p className="text-slate-500">+{rules.length - 4} more</p>
              )}
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign/Unassign Rules</DialogTitle>
          <DialogDescription>
            Edit rules for {hostname} ({ip}).
          </DialogDescription>
        </DialogHeader>
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center rounded border border-slate-200 p-2 pl-4"
          >
            <p>{rule.name}</p>
            <div className="ml-auto flex gap-1">
              <RuleCard
                rule={rule}
                refetch={refetch}
                trigger={
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                }
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  unassignRuleMutation.mutate({
                    macAddress,
                    ruleId: rule.id,
                  });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <div>
          Assign rule:{" "}
          <RulesCombobox
            onSelect={(ruleId) => {
              assignRuleMutation.mutate({
                macAddress,
                ruleId,
              });
            }}
          />
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="subtle">Done</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
