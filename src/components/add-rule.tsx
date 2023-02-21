import { useState } from "react";
import { X } from "lucide-react";

import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type AddRuleProps = {
  refetch: () => void;
};

export function AddRule({ refetch }: AddRuleProps) {
  const [name, setName] = useState<string>("");
  const [domains, setDomains] = useState<string>("");
  const [ports, setPorts] = useState<string>("");

  const addRuleMutation = trpc.rulesRouter.add.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="ml-auto">Add Rule</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="Rule name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              />
              <Button
                size="sm"
                variant="outline"
                className="ml-auto"
                disabled={ports === "" || ports.endsWith(",")}
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
          <Button
            variant="subtle"
            disabled={addRuleMutation.isLoading}
            onClick={() => {
              addRuleMutation.mutate({
                name: name.trim() || "Unnamed Rule",
                domains: domains.replace(/,+$/, "").trim(), // remove trailing commas and trim
                ports: ports.replace(/,+$/, "").trim(),
              });
            }}
          >
            Add Rule
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
