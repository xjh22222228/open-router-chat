"use client";
import React from "react";

export default function useApi() {
  const [API_KEY, setApiKey] = React.useState<string | null>(null);
  const [model, setModel] = React.useState<string | null>(null);

  React.useLayoutEffect(() => {
    setApiKey(
      localStorage.getItem("API_KEY") || process.env.NEXT_PUBLIC_API_KEY || null
    );
    setModel(
      localStorage.getItem("model") || process.env.NEXT_PUBLIC_MODEL || null
    );
  }, []);

  return {
    API_KEY,
    model,
  };
}
