import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, BarChart3, Globe2, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ExploreMarkets() {
  const [, setLocation] = useLocation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const features = [
    { icon: TrendingUp, title: "Real-time Forex", desc: "Live currency pairs with instant updates" },
    { icon: BarChart3, title: "Stock Markets", desc: "Global indices and individual stocks" },
    { icon: Globe2, title: "Commodities", desc: "Oil, gold, silver and more" },
    { icon: Sparkles, title: "Crypto", desc: "Cryptocurrency prices & trends" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with animation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-white/10 bg-black/20 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            className="mb-2 text-muted-foreground hover:text-foreground"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Explore <span className="text-primary">Markets</span>
          </h1>
          <p className="text-muted-foreground mt-2">Live data from global financial markets</p>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {features.map((feature, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="glass-panel p-6 border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-105">
              <feature.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Widget Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="container mx-auto px-4 py-8"
      >
        {/* Forex Rates Widget - iframe example */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-panel p-4 border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Major Currency Pairs
            </h2>
            <div className="bg-white/5 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
              {/* 
                !!! IMPORTANT !!! 
                Replace this entire div with the actual iframe code from:
                https://hk.investing.com/webmaster-tools/
                
                Example iframe (you MUST get your own from Investing.com):
                <iframe 
                  src="https://www.investing.com/webmaster-tools/forex-rates" 
                  width="100%" 
                  height="300" 
                  frameborder="0" 
                  allowtransparency="true" 
                  scrolling="yes"
                ></iframe>
              */}
              <p className="text-muted-foreground text-center">
                [Embed Investing.com Forex Widget Here]<br />
                Get your free widget from:<br />
                https://hk.investing.com/webmaster-tools/
              </p>
            </div>
          </Card>

          {/* Stock Market Widget */}
          <Card className="glass-panel p-4 border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Global Indices
            </h2>
            <div className="bg-white/5 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
              {/* Replace with your actual iframe code */}
              <p className="text-muted-foreground text-center">
                [Embed Investing.com Indices Widget Here]
              </p>
            </div>
          </Card>

          {/* Commodities Widget */}
          <Card className="glass-panel p-4 border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-primary" />
              Commodities
            </h2>
            <div className="bg-white/5 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
              {/* Replace with your actual iframe code */}
              <p className="text-muted-foreground text-center">
                [Embed Investing.com Commodities Widget Here]
              </p>
            </div>
          </Card>

          {/* Cryptocurrency Widget */}
          <Card className="glass-panel p-4 border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Cryptocurrency
            </h2>
            <div className="bg-white/5 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
              {/* Replace with your actual iframe code */}
              <p className="text-muted-foreground text-center">
                [Embed Investing.com Crypto Widget Here]
              </p>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-full blur-3xl"
        />
      </div>
    </div>
  );
}