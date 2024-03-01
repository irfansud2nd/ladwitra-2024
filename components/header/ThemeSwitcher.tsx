"use client";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const ThemeSwitcher = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();
  const onHome = usePathname().split("/")[1] == "";
  const session = useSession();
  const email = session.data?.user?.email;
  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      aria-label="Toggle theme"
      onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
      className={`${className} ${(onHome || !email) && "flex"}`}
    >
      <FiSun className="size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <FiMoon className="absolute size-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
export default ThemeSwitcher;
