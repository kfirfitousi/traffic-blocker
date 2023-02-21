import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { trpc } from "@/utils/trpc";

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
            placeholder="Name"
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
          <Button
            variant="subtle"
            onClick={() => {
              addRuleMutation.mutate({
                name,
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
