"use client";

import { useEffect, useState, useRef } from "react";

type AnimatedCounterProps = {
  value: number;
  className?: string;
  decimals?: number;
};

export function AnimatedCounter({ value, className, decimals = 0 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const valueRef = useRef(value);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    valueRef.current = value;
    const startValue = displayValue;
    const endValue = value;
    const duration = 1500;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      const easedValue = percentage < 0.5 
        ? 4 * percentage * percentage * percentage 
        : 1 - Math.pow(-2 * percentage + 2, 3) / 2;

      const currentValue = startValue + (endValue - startValue) * easedValue;
      setDisplayValue(currentValue);

      if (percentage < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value]);

  return (
    <span className={className}>
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}
