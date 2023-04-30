import { useState, useEffect } from "react";
import { Button } from "react-daisyui";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ToggleDark() {
  const [isDark, setIsDark] = useState(false);

  const toggleDark = () => {
    setIsDark((dark) => !dark);
  };

  useEffect(() => {
    if (localStorage.isDark) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      localStorage.isDark = true;
    } else {
      delete localStorage.isDark;
    }

    const root = document.querySelector("html");
    root.dataset.theme = isDark ? "dark" : "emerald";
  }, [isDark]);

  return (
    <Button color="ghost" className="rounded-full" onClick={toggleDark}>
      {isDark ? <FaSun /> : <FaMoon />}
    </Button>
  );
}
