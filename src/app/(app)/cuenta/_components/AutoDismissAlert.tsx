"use client";

import { useEffect, useState } from "react";

interface Props {
  type: "success" | "error";
  message: string;
}

export function AutoDismissAlert({ type, message }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className={`alert text-sm ${type === "success" ? "alert-success" : "alert-error"}`}>
      <i className={`fa-solid ${type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}`} />
      {message}
    </div>
  );
}
