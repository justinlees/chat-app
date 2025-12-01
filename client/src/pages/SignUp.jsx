import { useState } from "react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/signUp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password, mobile }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.message === "User created successfully") {
        alert("Account created successfully! 🎉");
        window.location.href = `/user/${data.user._id}`;
      } else {
        alert(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading State with Beautiful Spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center flex-col gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-8 border-purple-500/30 rounded-full animate-ping"></div>
          <div className="absolute top-0 w-20 h-20 border-8 border-t-purple-500 border-r-pink-500 border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-white text-lg font-medium animate-pulse">
          Creating your account...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Glassmorphism Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Me_Chat
            </h1>
            <p className="text-gray-300 mt-2 text-lg">Join the conversation</p>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Create Your Account
          </h2>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                placeholder="+1234567890"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg transform transition hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-purple-400 hover:text-purple-300 font-medium underline-offset-4 hover:underline transition"
              >
                Login here
              </a>
            </p>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 mt-10 leading-relaxed">
            By signing up, you agree to our Terms & Privacy Policy.
            <br />
            Your data is secure and never shared.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
