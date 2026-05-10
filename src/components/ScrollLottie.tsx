"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function ScrollLottie() {
  const [data, setData] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/scroll-down.json")
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return <div aria-hidden className="h-[40px] w-[25px]" />;
  }

  return (
    <Lottie
      animationData={data}
      loop
      autoplay
      aria-hidden
      className="h-[40px] w-[25px]"
    />
  );
}
