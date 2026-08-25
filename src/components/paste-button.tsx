"use client";

import { Button } from "@/components/ui/button";
import { Check, ClipboardPaste } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface PasteButtonProps
  extends Omit<
    React.ComponentPropsWithoutRef<"button">,
    "onClick" | "onPaste" | "children"
  > {
  onPaste: (text: string) => void;
  label?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
}

export function PasteButton({
  onPaste,
  label = "Paste",
  variant = "ghost",
  size = "sm",
  ...props
}: PasteButtonProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handlePaste = async () => {
    clearTimeout(timeoutRef.current);

    try {
      if (!navigator.clipboard?.readText) {
        throw new Error("Clipboard read API is unavailable in this browser/context.");
      }
      const text = await navigator.clipboard.readText();
      if (!text) {
        setStatus("error");
        timeoutRef.current = setTimeout(() => setStatus("idle"), 2000);
        return;
      }
      onPaste(text);
      setStatus("success");
      timeoutRef.current = setTimeout(() => setStatus("idle"), 1500);
    } catch (err) {
      console.error("Failed to read clipboard contents:", err);
      setStatus("error");
      timeoutRef.current = setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handlePaste}
      {...props}
    >
      {status === "success" ? (
        <>
          <Check className="mr-1 h-3 w-3" />
          Pasted
        </>
      ) : (
        <>
          <ClipboardPaste className="mr-1 h-3 w-3" />
          {label}
        </>
      )}
      <span className="sr-only" aria-live="polite">
        {status === "success" && "Pasted from clipboard"}
        {status === "error" && "Couldn't read clipboard"}
      </span>
    </Button>
  );
}
