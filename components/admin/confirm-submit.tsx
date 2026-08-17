"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Props = {
  confirmMessage: string;
  className?: string;
  children: ReactNode;
};

/**
 * Drop-in replacement for a plain submit button on destructive admin forms
 * (delete product, delete review, cancel/refund order, etc.). Blocks the
 * submit with a native confirm() dialog and shows a pending state.
 *
 * Always calls preventDefault() and, on confirm, submits the form via
 * form.requestSubmit() explicitly — relying on the browser's default
 * click-triggers-submit behavior after a blocking window.confirm() call is
 * unreliable (the pending default action can be dropped), so the submit is
 * triggered imperatively instead.
 */
export function ConfirmSubmitButton({ confirmMessage, className, children }: Props) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(className, pending && "opacity-50")}
      onClick={(e) => {
        e.preventDefault();
        if (!window.confirm(confirmMessage)) return;
        setPending(true);
        e.currentTarget.form?.requestSubmit();
      }}
    >
      {pending ? "Working…" : children}
    </button>
  );
}
