import { useEffect } from "react";
import { atom, useAtom } from "jotai";

const isScrolledAtom = atom(false);

export function useScrollTop(threshold = 10) {
  const [isScrolled, setIsScrolled] = useAtom(isScrolledAtom);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold, setIsScrolled]);

  return isScrolled;
}
