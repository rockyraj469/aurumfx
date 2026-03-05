import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+971",
    mobileNumber: "",
    country: "UAE",
    password: "",
    confirmPassword: "",
    promoCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Valid email is required");
      return false;
    }
    if (!formData.mobileNumber.match(/^\d[\d\s\-().]*\d$/)) {
      setError("Valid phone number is required");
      return false;
    }
    if (!formData.country) {
      setError("Please select a country");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!agreedToTerms) {
      setError("You must agree to the Terms and Conditions");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobileNumber: `${formData.countryCode}${formData.mobileNumber}`,
          country: formData.country,
          password: formData.password,
          promoCode: formData.promoCode || null,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Signup failed");
      }

      setSuccess(true);
      setTimeout(() => {
        setLocation("/kyc");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Account Created!</h1>
          <p className="text-muted-foreground mb-6">Redirecting to KYC verification...</p>
          <div className="h-2 w-32 bg-white/10 rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-yellow-700 flex items-center justify-center">
              <span className="text-sm font-bold text-black">Σ</span>
            </div>
            <span className="font-display text-2xl font-bold tracking-wider">
              AURUM<span className="text-primary">FX</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Trading Account</h1>
          <p className="text-muted-foreground">Join thousands of traders on AurumFX</p>
        </div>

        {/* Form */}
        <Card className="glass-panel p-8 border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm text-muted-foreground mb-2 block">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border-white/10 bg-black/40"
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="text-sm text-muted-foreground mb-2 block">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border-white/10 bg-black/40"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-sm text-muted-foreground mb-2 block">
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                className="border-white/10 bg-black/40"
                required
              />
            </div>

            {/* Mobile & Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mobileNumber" className="text-sm text-muted-foreground mb-2 block">
                  Mobile Number *
                </Label>
                <div className="flex gap-2">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="w-20 px-2 py-2 rounded border border-white/10 bg-black/40 text-foreground text-sm"
                  >
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+852">🇭🇰 +852</option>
                    <option value="+81">🇯🇵 +81</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+55">🇧🇷 +55</option>
                    <option value="+1">🇨🇦 +1</option>
                  </select>
                  <Input
                    id="mobileNumber"
                    name="mobileNumber"
                    placeholder="(555) 000-0000"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className="border-white/10 bg-black/40 flex-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country" className="text-sm text-muted-foreground mb-2 block">
                  Country *
                </Label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-white/10 bg-black/40 text-foreground text-sm"
                  required
                >
                  <option value="UAE">United Arab Emirates</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="SG">Singapore</option>
                  <option value="HK">Hong Kong</option>
                  <option value="JP">Japan</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="IN">India</option>
                  <option value="BR">Brazil</option>
                </select>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password" className="text-sm text-muted-foreground mb-2 block">
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="border-white/10 bg-black/40 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground mb-2 block">
                  Confirm Password *
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border-white/10 bg-black/40"
                  required
                />
              </div>
            </div>

            {/* Promo Code */}
            <div>
              <Label htmlFor="promoCode" className="text-sm text-muted-foreground mb-2 block">
                Promo Code (Optional)
              </Label>
              <Input
                id="promoCode"
                name="promoCode"
                placeholder="Enter promo code for brokers credit"
                value={formData.promoCode}
                onChange={handleChange}
                className="border-white/10 bg-black/40"
              />
              <p className="text-xs text-muted-foreground mt-1">Apply a promo code to receive trading credits</p>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => {
                    setAgreedToTerms(checked as boolean);
                    setError("");
                  }}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="terms" className="text-sm cursor-pointer">
                    <span className="text-foreground font-medium">I agree to the Terms and Conditions</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      I acknowledge that I have read and agree to the Terms of Service, Privacy Policy, and Risk Disclosure. 
                      I understand the risks involved in forex trading and confirm that this account is for individuals 18 years or older.
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded border border-red-500/30">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={loading} className="w-full box-glow text-base h-11 mt-6">
              {loading ? "Creating Account..." : "Create Account & Continue to KYC"}
            </Button>

            {/* Sign In Link */}
            <p className="text-xs text-muted-foreground text-center">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setLocation("/")}
                className="text-primary hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          </form>
        </Card>

        {/* Footer Note */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          All fields marked with * are required. We process your data in accordance with our Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
