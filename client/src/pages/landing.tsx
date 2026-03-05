import { motion } from "framer-motion";
import { ArrowRight, Activity, Shield, Globe, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) return <div className="min-h-screen bg-background" />;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Abstract Glowing Backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-yellow-700 flex items-center justify-center">
            <Activity className="w-5 h-5 text-black" />
          </div>
          <span className="font-display text-xl font-bold tracking-wider text-glow">AURUM<span className="text-primary">FX</span></span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/signup">
            <Button variant="glass" className="hidden sm:flex">Create Account</Button>
          </a>
          <a href="/api/login">
            <Button>
              Sign In <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-primary/30 text-primary text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Next Generation Trading Engine Live
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-foreground mb-6 leading-tight">
            Execute With <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-200 to-yellow-600">Absolute Precision</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Institutional-grade liquidity, sub-millisecond execution, and uncompromising security. Welcome to the new gold standard of forex trading.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a href="/explore" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-lg box-glow">
                Explore Markets <TrendingUp className="ml-2 w-4 h-4" />
              </Button>
            </a>
            <a href="/signup" className="w-full sm:w-auto">
              <Button size="lg" variant="glass" className="w-full sm:w-auto text-lg">
                Create Account
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </main>

      {/* Features Ribbon */}
      <div className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-md py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg mb-1">Deep Liquidity</h3>
              <p className="text-muted-foreground text-sm">Access to Tier-1 bank liquidity pools for the tightest spreads.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg mb-1">Cold Storage</h3>
              <p className="text-muted-foreground text-sm">Client funds are segregated and protected in offline vaults.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg mb-1">Global Access</h3>
              <p className="text-muted-foreground text-sm">Trade over 150+ currency pairs across all major markets.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}