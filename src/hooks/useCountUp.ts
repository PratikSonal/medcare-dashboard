import { useEffect, useState } from "react";

export const useCountUp = (target: number, duration = 1000): number => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};
