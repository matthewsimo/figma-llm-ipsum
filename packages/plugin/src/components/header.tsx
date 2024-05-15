import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Textarea } from "./ui/textarea";

type HeaderProps = {
  system: string;
  setSystem: (string) => void;
};

export default function Header({ system, setSystem }: HeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center gap-4 mb-8">
      <h1>LLM Ipsum</h1>
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings
              className="h-4 w-4 transition-transform hover:-rotate-45"
              aria-label="Open Settings"
            />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="inset-0 left-auto w-[80%]">
          <DrawerHeader className="text-left ">
            <DrawerTitle>Settings</DrawerTitle>
            <DrawerDescription>
              Control the system prompt and your API Token here
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <div className="flex flex-col space-y-4 gap-4 mb-12 items-start">
              <label htmlFor="system-prompt">System Prompt</label>
              <Textarea
                id="system-prompt"
                value={system}
                onChange={(e) => setSystem(e.target.value)}
              />
              {/* <Input placeholder="Token" /> */}
            </div>
          </div>
          <DrawerFooter>
            <Button>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
