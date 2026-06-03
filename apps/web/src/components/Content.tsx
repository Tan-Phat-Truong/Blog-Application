import type { PropsWithChildren } from "react";

export function Content({ children }: PropsWithChildren) {
  return <div className="px-8 py-4">{children}</div>;
}
