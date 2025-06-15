"use client";

import { useEffect, useState } from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 서버 사이드에서는 기본 레이아웃만 렌더링
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    );
  }

  // 클라이언트 사이드에서는 완전한 레이아웃 렌더링
  return (
    <div className="min-h-screen bg-background text-foreground">{children}</div>
  );
}
