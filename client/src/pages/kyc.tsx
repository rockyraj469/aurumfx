import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, AlertCircle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function KYC() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState<string>("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setDocumentFile(file);
      setFileName(file.name);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentFile) {
      setError("Please upload a government ID document");
      return;
    }

    setLoading(true);
    try {
      // Mock API call – simulate success
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLocation("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "KYC submission failed");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Button
          variant="ghost"
          className="mb-4 text-muted-foreground hover:text-foreground"
          onClick={goBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="glass-panel p-8 border-white/10">
          <h1 className="text-2xl font-bold mb-6 text-center">KYC Verification</h1>
          <p className="text-muted-foreground text-sm mb-6 text-center">
            Upload a clear copy of your government ID
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-8 border-2 border-dashed border-white/20 rounded-lg hover:border-primary/50 transition cursor-pointer hover:bg-white/5">
              <label htmlFor="document" className="cursor-pointer block">
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-primary mb-3" />
                  <p className="font-semibold text-foreground mb-1">
                    {fileName ? (
                      <>✓ <span className="text-green-400">{fileName}</span></>
                    ) : (
                      "Click to upload or drag and drop"
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    JPG/PNG/PDF (Max 5MB)
                  </p>
                </div>
                <input
                  id="document"
                  name="document"
                  type="file"
                  accept="image/png,image/jpeg,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded border border-red-500/30 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !documentFile}
              className="w-full box-glow"
            >
              {loading ? "Verifying..." : "Submit for Verification"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}