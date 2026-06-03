import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";
import { ThemeProvider } from "../Themes/ThemeContext";

export async function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  return (
    <div className="flex h-screen w-screen overflow-hidden  gap-4">


      <div className="w-64 h-full overflow-y-auto scroll-smooth ml-3">
        <LeftMenu />
      </div>


      <div className="flex-1 h-full overflow-y-auto ml-3">
        <Content>
          <TopMenu query={query} />
          {children}
        </Content>
      </div>

    </div>
  );
}
