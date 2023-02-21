import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import { cn } from "@/lib/utils";

type RulesComboboxProps = {
  onSelect: (ruleId: string) => void;
};

export function RulesCombobox({ onSelect }: RulesComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const rules = trpc.rulesRouter.getAll.useQuery();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? rules.data?.find((rule) => rule.name === value)?.name
            : "Select rule..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search rule..." />
          <CommandEmpty>No rules found.</CommandEmpty>
          <CommandGroup>
            {rules.data?.map((rule) => (
              <CommandItem
                key={rule.id}
                onSelect={() => {
                  onSelect(rule.id);
                  setValue("");
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === rule.name ? "opacity-100" : "opacity-0"
                  )}
                />
                {rule.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
