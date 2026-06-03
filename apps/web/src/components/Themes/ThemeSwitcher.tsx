"use client";

import { Button } from "@repo/ui/button";
import { useTheme } from "./ThemeContext";

const ThemeSwitch = () => {
  //const theme = "light"; // <- TODO: Get the theme from the context
const{ theme, toggleTheme } = useTheme();
  return (
<Button onClick={toggleTheme}>
  <span>
    {theme === "light" ? "🌙" : "☀️"}
  </span>
  <span style={{ marginLeft: "6px" }}>
    {theme === "light" ? "Dark Mode" : "Light Mode"}
  </span>
</Button>
  );
};

export default ThemeSwitch;
