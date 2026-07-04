"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const DEFAULT_DURATION = 900;

type RevealImageProps = Omit<ImageProps, "loading"> & {
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  delay?: number;
  duration?: number;
  shown?: boolean;
};

export function RevealImage({
  containerClassName = "",
  containerStyle,
  delay = 0,
  duration = DEFAULT_DURATION,
  shown,
  className,
  alt,
  priority,
  quality = 90,
  ...imageProps
}: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [self, setSelf] = useState(false);
  const visible = shown ?? self;

  useEffect(() => {
    if (shown !== undefined) return;
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSelf(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [shown]);

  return (
    <div
      ref={ref}
      className={`overflow-hidden ${containerClassName}`}
      style={containerStyle}
    >
      <div
        className="absolute inset-0"
        style={{
          clipPath: visible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          transition: `clip-path ${duration}ms ${EASE} ${delay}ms`,
          willChange: "clip-path",
        }}
        aria-hidden={!visible}
      >
        <Image
          {...imageProps}
          alt={alt}
          quality={quality}
          className={className}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
        />
      </div>
    </div>
  );
}
