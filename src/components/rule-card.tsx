import { useState } from "react";
import { type Rule } from "@prisma/client";
import { X } from "lucide-react";

import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
              id="name"
              type="text"
              placeholder="Rule name"
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
                  placeholder="example.com"
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
                  size="sm"
                  variant="outline"
                  className="ml-auto"
                  disabled={domains === ""}
                  onClick={() => {
                    setDomains((domains) =>
                      domains
                        .split(",")
                        .filter((_, j) => i !== j)
                        .join(",")
                    );
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              disabled={domains === "" || domains.endsWith(",")}
              onClick={() => setDomains((domains) => domains + ",")}
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
                  placeholder="80"
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
                  size="sm"
                  variant="outline"
                  className="ml-auto"
                  disabled={ports === ""}
                  onClick={() => {
                    setPorts((ports) =>
                      ports
                        .split(",")
                        .filter((_, j) => i !== j)
                        .join(",")
                    );
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              disabled={ports === "" || ports.endsWith(",")}
              onClick={() => setPorts((ports) => ports + ",")}
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
