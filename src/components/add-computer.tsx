import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

type AddComputerProps = {
  refetch: () => void;
};

export function AddComputer({ refetch }: AddComputerProps) {
  const [macAddress, setMacAddress] = useState<string>("");
  const [hostname, setHostname] = useState<string>("");
  const [ip, setIp] = useState<string>("");

  const addComputerMutation = trpc.computersRouter.add.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="ml-auto" variant="outline">
          Add Computer
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="mac">MAC ADDRESS</Label>
          <Input
            type="text"
            id="mac"
            placeholder="00:00:00:00:00:00"
            value={macAddress}
            onChange={(e) => setMacAddress(e.target.value)}
          />
          <Label htmlFor="hostname">HOSTNAME</Label>
          <Input
            type="text"
            id="hostname"
            placeholder="Hostname"
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
          />
          <Label htmlFor="ip">IP ADDRESS</Label>
          <Input
            type="text"
            id="ip"
            placeholder="0.0.0.0"
            value={ip}
            onChange={(e) => {
              setIp(e.target.value);
            }}
          />
          <Button
            variant="subtle"
            onClick={() => {
              addComputerMutation.mutate({
                macAddress,
                hostname,
                ip,
              });
            }}
          >
            Add Computer
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
