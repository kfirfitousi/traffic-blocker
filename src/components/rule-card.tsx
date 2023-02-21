import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { Rule } from "@prisma/client";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { X } from "lucide-react";

type RuleCardProps = {
  trigger: React.ReactNode;
  rule: Rule;
  refetch: () => void;
};

export function RuleCard({ trigger, rule, refetch }: RuleCardProps) {
  const [name, setName] = useState(rule.name);
  const [domains, setDomains] = useState(rule.domains);
  const [ports, setPorts] = useState(rule.ports);

  const { id } = rule;

  const updateRuleMutation = trpc.rulesRouter.update.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Dialog
        onOpenChange={() => {
          updateRuleMutation.mutate({
            id,
            domains: domains.replace(/,+$/, ""),
            ports: ports.replace(/,+$/, ""),
          });
        }}
      >
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Rule</DialogTitle>
            <DialogDescription>Block domains and ports.</DialogDescription>
          </DialogHeader>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => {
                updateRuleMutation.mutate({
                  id,
                  name: name.trim(),
                });
              }}
            />
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
                    updateRuleMutation.mutate({
                      id,
                      domains: domains.replace(/,+$/, ""),
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
              variant="outline"
              size="sm"
            >
              Add domain
            </Button>
            <Label className="mt-2">Ports</Label>
            {ports.split(",").map((port, i) => (
              <div
                key={i}
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
              variant="outline"
              size="sm"
            >
              Add port
            </Button>
          </div>
          <DialogFooter>
            <DialogTrigger asChild>
              <Button variant="ghost">Done</Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
