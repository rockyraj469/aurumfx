import { useQuery } from "@tanstack/react-query";

interface Portfolio {
  id: number;
  userId: string;
  balance: string;
}

export function usePortfolio() {
  return useQuery({
    queryKey: ["/api/portfolio"],
    queryFn: async (): Promise<Portfolio | null> => {
      const res = await fetch("/api/portfolio", { credentials: "include" });
      if (res.status === 401) return null;
      if (res.status === 404) return null; // New users might not have a portfolio yet
      if (!res.ok) throw new Error("Failed to fetch portfolio");
      return res.json();
    },
  });
}
