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
          ? (err.response?.data?.error ?? "Failed to send code")
          : "Failed to send code";
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
        navigate("/");
      } catch (err) {
        const msg =
          err instanceof AxiosError
            ? (err.response?.data?.error ?? "Invalid or expired code")
            : "Invalid or expired code";
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
      toast.success("Code resent");
    } catch {
      // error already toasted
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6 max-w-xs w-full", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <FieldGroup className="gap-8">
        <Field className="mt-3">
          {step === "email" ? (
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="write your email here..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-2xl bg-white border-2 border-primary/20 focus:border-primary/50 transition-all h-14 text-lg font-heading italic shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]"
              />
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-6">
                <p className="text-sm font-heading italic text-muted-foreground">Enter the magic code ✨</p>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={loading}
                  autoFocus
                >
                  <InputOTPGroup className="gap-3">
                    <InputOTPSlot index={0} className="rounded-xl border-2 border-primary/20 h-14 w-12 text-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]" />
                    <InputOTPSlot index={1} className="rounded-xl border-2 border-primary/20 h-14 w-12 text-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]" />
                    <InputOTPSlot index={2} className="rounded-xl border-2 border-primary/20 h-14 w-12 text-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]" />
                  </InputOTPGroup>
                  <InputOTPGroup className="gap-3">
                    <InputOTPSlot index={3} className="rounded-xl border-2 border-primary/20 h-14 w-12 text-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]" />
                    <InputOTPSlot index={4} className="rounded-xl border-2 border-primary/20 h-14 w-12 text-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]" />
                    <InputOTPSlot index={5} className="rounded-xl border-2 border-primary/20 h-14 w-12 text-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]" />
                  </InputOTPGroup>
                </InputOTP>

                <div className="flex gap-4">
                  <Button type="button" variant="ghost" size="sm" disabled={loading} onClick={handleResend} className="text-muted-foreground hover:text-primary font-heading italic">
                    <RotateCcw className="mr-2 size-4" /> Send again?
                  </Button>
                  <Button type="button" variant="ghost" size="sm" disabled={loading} onClick={() => { setStep("email"); setOtp(""); }} className="text-muted-foreground hover:text-primary font-heading italic">
                    <Pen className="mr-2 size-4" /> Oops, wrong email
                  </Button>
                </div>
              </div>
            </>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl text-xl font-heading shadow-[0_8px_0px_0px_oklch(0.5_0.15_35)] hover:shadow-[0_4px_0px_0px_oklch(0.5_0.15_35)] hover:translate-y-[4px] active:shadow-none active:translate-y-[8px] transition-all bg-primary text-white border-2 border-black/10">
            {loading ? <Loader2 className="animate-spin" /> : step === "email" ? "Open My Journal" : "Sign Me In!"}
          </Button>
        </Field>

        <div className="relative flex items-center gap-4 py-2">
          <div className="h-0.5 bg-primary/10 flex-1 rounded-full" />
          <span className="text-primary/40 text-xs font-bold uppercase tracking-widest">social sign in</span>
          <div className="h-0.5 bg-primary/10 flex-1 rounded-full" />
        </div>

        <Field className="gap-4">
          <OAuthButtons />
        </Field>
      </FieldGroup>
    </form>
  );
}
