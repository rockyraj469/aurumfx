import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useTrades, useCreateTrade } from "@/hooks/use-trades";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Wallet, Activity, LogOut, Plus, Minus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const chartData = [
  { date: "Mon", value: 4200 },
  { date: "Tue", value: 4400 },
  { date: "Wed", value: 3800 },
  { date: "Thu", value: 5100 },
  { date: "Fri", value: 4900 },
  { date: "Sat", value: 5300 },
  { date: "Sun", value: 5800 },
];

export default function Dashboard() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio();
  const { data: trades = [] } = useTrades();
  const { mutate: createTrade, isPending } = useCreateTrade();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    symbol: "EURUSD",
    type: "buy",
    amount: "",
    price: "",
  });

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const handleLogout = () => {
    logout();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount && formData.price) {
      createTrade(formData, {
        onSuccess: () => {
          setFormData({
            symbol: "EURUSD",
            type: "buy",
            amount: "",
            price: "",
          });
        },
      });
    }
  };

  if (isLoading || portfolioLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const profitLoss = trades.reduce((acc, trade) => {
    const pl = parseFloat(trade.price) * parseFloat(trade.amount);
    return trade.type === "buy" ? acc - pl : acc + pl;
  }, 0);

  const walletBalance = portfolio?.balance ? parseFloat(portfolio.balance) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-yellow-700 flex items-center justify-center">
              <Activity className="w-5 h-5 text-black" />
            </div>
            <span className="font-display text-xl font-bold tracking-wider text-glow">
              AURUM<span className="text-primary">FX</span>
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Portfolio Balance Card */}
          <motion.div variants={itemVariants}>
            <Card className="glass-panel p-6 border-primary/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-muted-foreground text-sm">Portfolio Balance</Label>
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground">
                  ${walletBalance.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Current balance</p>
              </div>
            </Card>
          </motion.div>

          {/* Total Trades Card */}
          <motion.div variants={itemVariants}>
            <Card className="glass-panel p-6 border-cyan-500/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-muted-foreground text-sm">Total Trades</Label>
                  <Activity className="w-5 h-5 text-cyan-500" />
                </div>
                <div className="text-3xl font-bold text-foreground">{trades.length}</div>
                <p className="text-xs text-muted-foreground mt-2">Executed trades</p>
              </div>
            </Card>
          </motion.div>

          {/* Win Rate Card */}
          <motion.div variants={itemVariants}>
            <Card className="glass-panel p-6 border-green-500/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-muted-foreground text-sm">Winning Trades</Label>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {trades.filter((t) => t.type === "sell").length}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Sell trades</p>
              </div>
            </Card>
          </motion.div>

          {/* Profit/Loss Card */}
          <motion.div variants={itemVariants}>
            <Card className={`glass-panel p-6 border-${profitLoss >= 0 ? "green" : "red"}-500/20 relative overflow-hidden group`}>
              <div className={`absolute inset-0 bg-gradient-to-br from-${profitLoss >= 0 ? "green" : "red"}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-muted-foreground text-sm">P&L</Label>
                  {profitLoss >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className={`text-3xl font-bold ${profitLoss >= 0 ? "text-green-500" : "text-red-500"}`}>
                  ${profitLoss.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Profit/Loss</p>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="glass-panel p-6 border-white/10">
              <h2 className="text-lg font-bold mb-6 text-foreground">Portfolio Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(212,175,55,0.5)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#d4af37" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Trade Form */}
          <motion.div variants={itemVariants}>
            <Card className="glass-panel p-6 border-primary/20 sticky top-24">
              <h2 className="text-lg font-bold mb-6 text-foreground">Execute Trade</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="symbol" className="text-sm text-muted-foreground mb-2 block">
                    Symbol
                  </Label>
                  <Select value={formData.symbol} onValueChange={(value) => setFormData({ ...formData, symbol: value })}>
                    <SelectTrigger id="symbol" className="border-white/10 bg-black/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EURUSD">EUR/USD</SelectItem>
                      <SelectItem value="GBPUSD">GBP/USD</SelectItem>
                      <SelectItem value="USDJPY">USD/JPY</SelectItem>
                      <SelectItem value="AUDUSD">AUD/USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type" className="text-sm text-muted-foreground mb-2 block">
                    Type
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger id="type" className="border-white/10 bg-black/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">
                        <div className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-green-500" />
                          Buy
                        </div>
                      </SelectItem>
                      <SelectItem value="sell">
                        <div className="flex items-center gap-2">
                          <Minus className="w-4 h-4 text-red-500" />
                          Sell
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount" className="text-sm text-muted-foreground mb-2 block">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="border-white/10 bg-black/40"
                  />
                </div>

                <div>
                  <Label htmlFor="price" className="text-sm text-muted-foreground mb-2 block">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.0001"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="border-white/10 bg-black/40"
                  />
                </div>

                <Button type="submit" disabled={isPending} className="w-full box-glow">
                  {isPending ? "Executing..." : "Execute Trade"}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>

        {/* Recent Trades */}
        <motion.div variants={itemVariants} className="mt-8">
          <Card className="glass-panel p-6 border-white/10">
            <h2 className="text-lg font-bold mb-6 text-foreground">Recent Trades</h2>
            {trades.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No trades yet. Execute your first trade above!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Symbol</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Amount</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Price</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((trade) => (
                      <tr key={trade.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 font-medium">{trade.symbol}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {trade.type === "buy" ? (
                              <>
                                <Plus className="w-4 h-4 text-green-500" />
                                <span className="text-green-500">Buy</span>
                              </>
                            ) : (
                              <>
                                <Minus className="w-4 h-4 text-red-500" />
                                <span className="text-red-500">Sell</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">{parseFloat(trade.amount).toFixed(2)}</td>
                        <td className="py-4 px-4">${parseFloat(trade.price).toFixed(4)}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            trade.status === "completed"
                              ? "bg-green-500/10 text-green-500"
                              : trade.status === "pending"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-red-500/10 text-red-500"
                          }`}>
                            {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground text-xs">
                          {new Date(trade.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
