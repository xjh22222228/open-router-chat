"use client";
import React from "react";

export default function useApi() {
  const [apiKey, setApiKey] = React.useState<string | null>(null);

  React.useEffect(() => {
    setApiKey(
      localStorage.getItem("API_KEY") || process.env.NEXT_PUBLIC_API_KEY || null
    );
  }, []);

  return [apiKey, setApiKey];
}
