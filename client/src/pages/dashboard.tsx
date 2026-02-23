import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { LogOut, ArrowUpRight, ArrowDownRight, Activity, TrendingUp, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useTrades, useCreateTrade } from "@/hooks/use-trades";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency, cn } from "@/lib/utils";

// Mock data generator for the chart to simulate live market feel
const generateMarketData = () => {
  let basePrice = 1.0850;
  return Array.from({ length: 50 }).map((_, i) => {
    basePrice = basePrice + (Math.random() - 0.5) * 0.002;
    return {
      time: i,
      price: Number(basePrice.toFixed(4)),
    };
  });
};

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: portfolio, isLoading: isLoadingPortfolio } = usePortfolio();
  const { data: trades = [], isLoading: isLoadingTrades } = useTrades();
  const { mutate: executeTrade, isPending: isTrading } = useCreateTrade();

  const [tradeSymbol, setTradeSymbol] = useState("EUR/USD");
  const [tradeAmount, setTradeAmount] = useState("");
  const [marketData, setMarketData] = useState(generateMarketData());
  const [currentPrice, setCurrentPrice] = useState(marketData[marketData.length - 1].price);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => {
        const lastPrice = prev[prev.length - 1].price;
        const newPrice = Number((lastPrice + (Math.random() - 0.5) * 0.001).toFixed(4));
        setCurrentPrice(newPrice);
        const newData = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, price: newPrice }];
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTrade = (type: "buy" | "sell") => {
    if (!tradeAmount || isNaN(Number(tradeAmount)) || Number(tradeAmount) <= 0) return;
    
    executeTrade({
      symbol: tradeSymbol,
      type,
      amount: tradeAmount,
      price: currentPrice.toString(),
    }, {
      onSuccess: () => {
        setTradeAmount("");
        // Could add a local toast notification here
      }
    });
  };

  const balance = portfolio?.balance ? Number(portfolio.balance) : 100000;
  
  // Calculate P&L mock (just for visual flair based on recent trades)
  const unrealizedPnL = useMemo(() => {
    return trades.slice(0, 5).reduce((acc, t) => {
      const isBuy = t.type.toLowerCase() === 'buy';
      const priceDiff = currentPrice - Number(t.price);
      const profit = (isBuy ? priceDiff : -priceDiff) * Number(t.amount) * 1000; // Mock leverage multiplier
      return acc + profit;
    }, 0);
  }, [trades, currentPrice]);

  if (isLoading || !isAuthenticated) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-yellow-700 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <Activity className="w-5 h-5 text-black" />
            </div>
            <span className="font-display text-xl font-bold tracking-wider hidden sm:block text-glow">AURUM<span className="text-primary">FX</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Available Equity</span>
              <span className="font-numbers text-lg font-bold text-primary">
                {isLoadingPortfolio ? "---" : formatCurrency(balance)}
              </span>
            </div>
            <div className="h-8 w-px bg-white/10 hidden md:block" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-white/10 text-sm font-medium">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column - Charts & Stats */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Total Balance</p>
                  <p className="text-2xl font-numbers font-bold">{formatCurrency(balance)}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Activity className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Active Positions</p>
                  <p className="text-2xl font-numbers font-bold">{trades.filter(t => t.status === 'open').length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Unrealized P&L</p>
                  <p className={cn("text-2xl font-numbers font-bold", unrealizedPnL >= 0 ? "text-success" : "text-destructive")}>
                    {unrealizedPnL > 0 ? "+" : ""}{formatCurrency(unrealizedPnL)}
                  </p>
                </div>
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", unrealizedPnL >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                  {unrealizedPnL >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Area */}
          <Card className="flex-1 min-h-[400px] flex flex-col relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
              <div>
                <CardTitle className="text-2xl flex items-center gap-3">
                  {tradeSymbol} 
                  <span className="text-sm px-2 py-1 rounded bg-secondary text-muted-foreground border border-white/5">Prime FX</span>
                </CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <span className={cn(
                    "text-3xl font-numbers font-bold tracking-tight",
                    currentPrice > marketData[marketData.length - 2].price ? "text-success" : "text-destructive"
                  )}>
                    {currentPrice.toFixed(5)}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse mr-2" /> Live
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {["1H", "1D", "1W", "1M"].map((tf) => (
                  <Button key={tf} variant={tf === "1H" ? "default" : "glass"} size="sm" className="h-8 text-xs">
                    {tf}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <div className="flex-1 w-full relative z-0 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['dataMin - 0.001', 'dataMax + 0.001']} hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--primary))', fontFamily: 'var(--font-mono)' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right Column - Execution & History */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Order Entry */}
          <Card className="relative overflow-hidden border-primary/20 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            <CardHeader>
              <CardTitle>Order Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Symbol</span>
                  <span className="font-semibold">{tradeSymbol}</span>
                </div>
                <div className="flex gap-2">
                  {["EUR/USD", "GBP/USD", "USD/JPY"].map(sym => (
                    <Button 
                      key={sym} 
                      variant={tradeSymbol === sym ? "default" : "glass"} 
                      size="sm" 
                      onClick={() => setTradeSymbol(sym)}
                      className="flex-1 text-xs"
                    >
                      {sym}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Volume (Lots)</span>
                </div>
                <div className="relative">
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0.01"
                    placeholder="0.00"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    className="pr-12 text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                    LOT
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Margin Req: {formatCurrency(Number(tradeAmount || 0) * 1000)}</span>
                  <span>Leverage: 1:100</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <Button 
                  size="lg" 
                  className="bg-destructive hover:bg-destructive/90 text-white font-bold tracking-wide"
                  disabled={isTrading || !tradeAmount}
                  onClick={() => handleTrade("sell")}
                >
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-xs uppercase opacity-80 mb-1">Sell</span>
                    <span>{(currentPrice - 0.00012).toFixed(5)}</span>
                  </div>
                </Button>
                <Button 
                  size="lg" 
                  className="bg-success hover:bg-success/90 text-white font-bold tracking-wide"
                  disabled={isTrading || !tradeAmount}
                  onClick={() => handleTrade("buy")}
                >
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-xs uppercase opacity-80 mb-1">Buy</span>
                    <span>{(currentPrice + 0.00012).toFixed(5)}</span>
                  </div>
                </Button>
              </div>
              
              <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 border border-white/5 text-xs text-muted-foreground">
                <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p>Execution is market. Slippage may occur during high volatility.</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Trades List */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-lg">Recent Executions</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[300px] lg:max-h-none flex-1">
              {isLoadingTrades ? (
                <div className="p-6 text-center text-muted-foreground animate-pulse">Loading execution history...</div>
              ) : trades.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">No recent trades.</div>
              ) : (
                <div className="flex flex-col">
                  <AnimatePresence initial={false}>
                    {trades.map((trade, i) => {
                      const isBuy = trade.type.toLowerCase() === 'buy';
                      return (
                        <motion.div 
                          key={trade.id}
                          initial={{ opacity: 0, height: 0, backgroundColor: "hsl(var(--primary)/0.2)" }}
                          animate={{ opacity: 1, height: "auto", backgroundColor: "transparent" }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              isBuy ? "bg-success" : "bg-destructive"
                            )} />
                            <div>
                              <p className="font-semibold text-sm">{trade.symbol}</p>
                              <p className="text-xs text-muted-foreground font-numbers">
                                {new Date(trade.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-numbers text-sm font-medium">{trade.price}</p>
                            <p className={cn(
                              "text-xs font-semibold uppercase",
                              isBuy ? "text-success" : "text-destructive"
                            )}>
                              {trade.type} • {trade.amount} L
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
