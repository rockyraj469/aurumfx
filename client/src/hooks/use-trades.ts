import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Trade {
  id: number;
  userId: string;
  symbol: string;
  type: string;
  amount: string;
  price: string;
  status: string;
  createdAt: string;
}

export interface CreateTradeInput {
  symbol: string;
  type: string;
  amount: string;
  price: string;
}

export function useTrades() {
  return useQuery({
    queryKey: ["/api/trades"],
    queryFn: async (): Promise<Trade[]> => {
      const res = await fetch("/api/trades", { credentials: "include" });
      if (res.status === 401) return [];
      if (!res.ok) throw new Error("Failed to fetch trades");
      return res.json();
    },
  });
}

export function useCreateTrade() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateTradeInput) => {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to execute trade");
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalidate both trades list and portfolio balance
      queryClient.invalidateQueries({ queryKey: ["/api/trades"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
    },
  });
}
