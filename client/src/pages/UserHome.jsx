import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatContacts from "../components/ChatContacts.jsx";

const User = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { senderId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BASE_URL || "http://localhost:5000"
          }/user/${senderId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();

        if (data.message === "UnAuthorized request") {
          window.location.href = "/login";
        }
        if (data.user) {
          setUser(data.user);
        }
        if (data.message === "User not found") {
          setError("User Does Not Exist");
        }
        if (data.message === "Internal server error") {
          setError("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [senderId]);

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-red-400 mb-4">
            {error}
          </h1>
          <p className="text-gray-300">Please try logging in again.</p>
          <a
            href="/login"
            className="mt-6 inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center flex-col gap-8">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-purple-500/30 rounded-full animate-ping"></div>
          <div className="absolute top-0 w-24 h-24 border-8 border-t-purple-500 border-r-pink-500 border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-xl text-white font-medium animate-pulse">
          Loading your chats...
        </p>
      </div>
    );
  }

  // No User State
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-400">
          No User Details Found
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Top Bar */}
      <header className="bg-black/30 backdrop-blur-xl border-b border-white/10 px-6 py-4 shadow-2xl z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Me_Chat
            </h1>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="text-white font-semibold text-lg">{user.name}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden">
        <ChatContacts user={user} />
      </main>

      {/* Optional Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 py-3 text-center">
        <p className="text-xs text-gray-400">
          © 2025 Me_Chat • Secure & Private Messaging
        </p>
      </footer>
    </div>
  );
};

export default User;
