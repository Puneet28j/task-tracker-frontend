import { Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

const themes = ["light", "dark", "system"] as const;

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const nextTheme = () => {
    const index = themes.indexOf(theme as (typeof themes)[number]);
    const next = themes[(index + 1) % themes.length];
    setTheme(next);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={nextTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" && <Sun className="h-5 w-5" />}
      {theme === "dark" && <Moon className="h-5 w-5" />}
      {theme === "system" && <Laptop className="h-5 w-5" />}
    </Button>
  );
}
