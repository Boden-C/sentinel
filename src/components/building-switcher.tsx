import * as React from "react"
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Building } from "lucide-react"

const buildings = [
  {
    label: "Dallas Office",
    value: "Dallas",
  },
  {
    label: "Dubai Office",
    value: "Dubai",
  }
];

export function BuildingSwitcher({ onBuildingChange }) {
  const [open, setOpen] = React.useState(false)
  const [showNewBuildingDialog, setShowNewBuildingDialog] = React.useState(false)
  const [selectedBuilding, setSelectedBuilding] = React.useState(() => {
    // Initialize from localStorage or default to first building
    const saved = localStorage.getItem('selectedBuilding');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved building:', e);
      }
    }
    return buildings[0];
  });

  // Update localStorage when selection changes
  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building);
    localStorage.setItem('selectedBuilding', JSON.stringify(building));
    setOpen(false);
    if (onBuildingChange) {
      onBuildingChange(building.value);
    }
  };

  // Notify parent of initial building on mount
  React.useEffect(() => {
    if (onBuildingChange) {
      onBuildingChange(selectedBuilding.value);
    }
  }, []);

  return (
    <Dialog open={showNewBuildingDialog} onOpenChange={setShowNewBuildingDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a building"
            className="w-[200px] justify-between"
          >
            <Building className="mr-2 h-4 w-4" />
            {selectedBuilding.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search buildings..." />
              <CommandEmpty>No building found.</CommandEmpty>
              <CommandGroup heading="Buildings">
                {buildings.map((building) => (
                  <CommandItem
                    key={building.value}
                    onSelect={() => handleBuildingSelect(building)}
                    className="text-sm"
                  >
                    <Building className="mr-2 h-4 w-4" />
                    {building.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedBuilding.value === building.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setShowNewBuildingDialog(true)
                    setOpen(false)
                  }}
                >
                  <PlusCircledIcon className="mr-2 h-4 w-4" />
                  Add Building
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Building</DialogTitle>
          <DialogDescription>
            Add a new building to manage its energy consumption.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Building name</Label>
              <Input id="name" placeholder="Enter building name" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewBuildingDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowNewBuildingDialog(false)}>
            Add Building
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}