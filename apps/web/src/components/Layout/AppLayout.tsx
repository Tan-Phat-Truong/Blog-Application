import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";

export async function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="w-64 h-full overflow-y-auto scroll-smooth flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
        <LeftMenu />
      </div>
      <div className="flex-1 h-full overflow-y-auto">
        <Content>
          <TopMenu query={query} />
          {children}
        </Content>
      </div>
    </div>
  );
}
