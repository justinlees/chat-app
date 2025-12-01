const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      {/* Main Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10">
        {/* Logo/Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Me_Chat
          </h1>
          <p className="text-gray-300 mt-3 text-lg">Your private messenger</p>
        </div>

        {/* Beta Warning Alert */}
        <div className="bg-orange-500/20 border border-orange-500/50 rounded-xl p-5 mb-8 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-orange-300 flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.742-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Important Notice (Beta Version)
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-200">
            <li>• Forgot password is not available yet</li>
            <li>• No account or message deletion options</li>
            <li>• Please remember your password carefully</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <a
            href="/signUp"
            className="w-full block text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Create New Account
          </a>

          <a
            href="/login"
            className="w-full block text-center bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-medium py-4 px-6 rounded-xl border border-white/30 transition-all duration-300 hover:shadow-xl"
          >
            Login to Existing Account
          </a>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-400 text-xs mt-8">
          More features coming soon • Thank you for testing!
        </p>
      </div>
    </div>
  );
};

export default Home;
