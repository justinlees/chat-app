import { useEffect, useState } from "react";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/login`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.message === "User Token exist") {
          window.location.href = `/user/${data.user._id}`;
        }
      } catch (error) {
        alert("Server Error");
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginUser = {
      email: e.target.Email.value,
      password: e.target.Password.value,
    };

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginUser),
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.message === "Login success") {
        window.location.href = `/user/${data.user._id}`;
      } else {
        alert(data.message);
        window.location.href = "/login";
      }
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
      e.target.reset();
    }
  };

  // Loading Screen with Spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center flex-col gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-8 border-purple-500/30 rounded-full animate-ping"></div>
          <div className="absolute top-0 w-20 h-20 border-8 border-t-purple-500 border-r-pink-500 border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-white text-lg font-medium animate-pulse">
          Checking your session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Me_Chat
            </h1>
            <p className="text-gray-300 mt-2">Welcome back! Please login</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="Email"
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="Password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg transform transition hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login to Account"}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <a
                href="/signUp"
                className="text-purple-400 hover:text-purple-300 font-medium underline-offset-4 hover:underline transition"
              >
                Sign Up
              </a>
            </p>

            <a
              href="/forgot-password"
              className="block text-sm text-gray-400 hover:text-gray-200 transition"
            >
              Forgot Password?
            </a>
          </div>

          {/* Beta Note */}
          <p className="text-center text-xs text-gray-500 mt-10">
            Note: Forgot password is temporarily unavailable in beta.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
