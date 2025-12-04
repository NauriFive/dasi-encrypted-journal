import { useState } from "react";
import { useAuthStore } from "../store/useAthStore";
import { Mail, Lock, Eye, EyeOff, Loader2, Rabbit } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Email is required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Invalid email.");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValidated = validateForm();

    if (isValidated) {
      login(formData);
    }
  };

  return (
    <div>
      {/* 📃 Login form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-5">
          {/* Ⓜ️ Logo */}
          <div className="text-center mb-5">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Rabbit className="size-8 text-primary stroke-1" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome back</h1>
              <p className="text-base-content/60">
                Join us in the fight against distraction!
              </p>
            </div>
          </div>

          {/* 📃 Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 🫠 Username */}
            <div className="form-control mb-5">
              <label className="label mb-1">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                    <Mail
                      className="size-5 opacity-70"
                      style={{ strokeWidth: 1 }}
                    />
                  </div>
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10 focus:outline-none focus:border-gray-300`}
                  placeholder="BruceWayne67"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* 🔐 Password */}
            <div className="form-control mb-5">
              <label className="label mb-1">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                  <Lock
                    className="size-5 opacity-70"
                    style={{ strokeWidth: 1 }}
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10 focus:outline-none focus:border-gray-300`}
                  placeholder="•••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* 💖 Submit button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          {/* 🔗 Link */}
          <div className="text-center">
            <p className="text-base-content/60">
              Doesn't have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
