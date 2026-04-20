import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";
import { Loader2, Pen, RotateCcw } from "lucide-react";
import { OAuthButtons } from "@/components/signin/OAuthButtons";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const SignInForm = ({
  className,
  ...props
}: React.ComponentProps<"form">) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/send-otp", { Email: email });
    } catch (err) {
      const msg =
        err instanceof AxiosError
          ? (err.response?.data?.error ?? "Oh no! Failed to send code 🙊")
          : "Oh no! Failed to send code 🙊";
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "email") {
      try {
        await sendOtp();
        setStep("otp");
      } catch {
        // error already toasted
      }
    } else {
      setLoading(true);
      try {
        await axiosInstance.post("/auth/verify-otp", { Email: email, OTP: otp });
        navigate("/journal");
      } catch (err) {
        const msg =
          err instanceof AxiosError
            ? (err.response?.data?.error ?? "Invalid code! Try again? 🦄")
            : "Invalid code! Try again? 🦄";
        toast.error(msg);
        setOtp("");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResend = async () => {
    try {
      await sendOtp();
      setOtp("");
      toast.success("Code sent again! 💌");
    } catch {
      // error already toasted
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-8 w-full", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <FieldGroup className="gap-8">
        <Field>
          {step === "email" ? (
            <div className="relative group">
              <Input
                id="email"
                type="email"
                placeholder="Your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-16 px-6 rounded-2xl border-4 border-foreground/10 bg-white text-lg font-medium focus:border-primary focus:ring-0 transition-all shadow-[8px_8px_0px_0px_oklch(0.25_0.05_30/0.05)] group-hover:shadow-[12px_12px_0px_0px_oklch(0.25_0.05_30/0.08)]"
              />
              <div className="absolute -top-3 -right-2 bg-accent text-accent-foreground text-[10px] font-black px-3 py-1 rounded-full border-2 border-foreground rotate-12 shadow-sm">
                HELLO! 👋
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <div className="text-center space-y-1">
                <p className="font-heading font-bold text-xl">Check your inbox! 📬</p>
                <p className="text-sm text-muted-foreground italic">We sent a magic code to {email}</p>
              </div>
              
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                disabled={loading}
                autoFocus
              >
                <InputOTPGroup className="gap-3">
                  <InputOTPSlot index={0} className="w-14 h-16 rounded-xl border-4 border-foreground/10 text-xl font-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]" />
                  <InputOTPSlot index={1} className="w-14 h-16 rounded-xl border-4 border-foreground/10 text-xl font-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]" />
                  <InputOTPSlot index={2} className="w-14 h-16 rounded-xl border-4 border-foreground/10 text-xl font-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]" />
                </InputOTPGroup>
                <InputOTPGroup className="gap-3">
                  <InputOTPSlot index={3} className="w-14 h-16 rounded-xl border-4 border-foreground/10 text-xl font-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]" />
                  <InputOTPSlot index={4} className="w-14 h-16 rounded-xl border-4 border-foreground/10 text-xl font-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]" />
                  <InputOTPSlot index={5} className="w-14 h-16 rounded-xl border-4 border-foreground/10 text-xl font-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]" />
                </InputOTPGroup>
              </InputOTP>

              <div className="flex gap-4">
                <button type="button" disabled={loading} onClick={handleResend} className="flex items-center text-sm font-bold text-primary hover:underline transition-all underline-offset-4">
                  <RotateCcw className="mr-2 size-4" /> Send again
                </button>
                <button type="button" disabled={loading} onClick={() => { setStep("email"); setOtp(""); }} className="flex items-center text-sm font-bold text-muted-foreground hover:text-foreground hover:underline transition-all underline-offset-4">
                  <Pen className="mr-2 size-4" /> Wrong email?
                </button>
              </div>
            </div>
          )}
        </Field>

        <Button 
          type="submit" 
          disabled={loading} 
          className="h-16 w-full rounded-2xl text-xl font-black bg-primary text-primary-foreground border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
        >
          {loading ? (
            <Loader2 className="animate-spin size-8" />
          ) : step === "email" ? (
            "Open My Journal"
          ) : (
            "Let's Go!"
          )}
        </Button>

        <div className="relative flex items-center gap-4 py-2">
          <div className="h-1 bg-foreground/5 flex-1 rounded-full" />
          <span className="text-foreground/30 text-[10px] font-black uppercase tracking-[0.2em]">or hang out with</span>
          <div className="h-1 bg-foreground/5 flex-1 rounded-full" />
        </div>

        <OAuthButtons />
      </FieldGroup>
    </form>
  );
}
