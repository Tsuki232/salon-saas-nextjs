"use client";

import { useRouter } from "next/navigation";

export function DateJumpInput({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  return (
    <input
      type="date"
      defaultValue={defaultValue}
      onChange={(e) => router.push(`/citas?fecha=${e.target.value}`)}
      className="rounded-xl glass px-3 py-1.5 text-sm text-[var(--foreground)] outline-none focus:ring-4 focus:ring-[var(--accent-from)]/15"
    />
  );
}
