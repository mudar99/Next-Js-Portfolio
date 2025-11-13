"use client";

import { useEffect, ReactNode } from "react";

interface ScrollLockRemoverProps {
  children: ReactNode;
}

export default function ScrollLockProvider({
  children,
}: ScrollLockRemoverProps) {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const body = document.body;
      if (body.hasAttribute("data-scroll-locked")) {
        body.removeAttribute("data-scroll-locked");
        body.style.paddingRight = "0px";
        body.style.overflow = "";
      }
    });
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
