"use client";

import { useEffect } from "react";
import { DataState } from "@/components/ui/data-state";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => console.error(error), [error]);
  return (
    <div className="shell page-space">
      <DataState description="页面数据请求失败，但应用仍可继续使用。请重试或稍后刷新。" />
      <button className="button button-primary state-action" onClick={reset}>
        重新加载
      </button>
    </div>
  );
}
