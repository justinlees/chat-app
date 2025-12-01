const ReceiverInfoPopUp = ({ userDetails, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl px-4 py-4 overflow-y-auto">
      {/* Full-screen overlay with safe padding & scroll support */}

      <div className="relative w-full max-w-md max-h-screen bg-gradient-to-br from-slate-900/98 via-purple-900/98 to-slate-900/98 rounded-3xl shadow-3xl border border-white/30 overflow-hidden backdrop-blur-3xl">
        {/* Close Button - Better visibility & tap area */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md text-gray-300 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Scrollable Content Container */}
        <div className="flex flex-col items-center pt-16 pb-8 px-6 max-h-screen overflow-y-auto scrollbar-hide">
          {/* Profile Image - Slightly smaller & pulled up less aggressively */}
          <div className="relative -mt-12 mb-6">
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full ring-4 ring-purple-500/70 shadow-2xl overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 p-1.5">
              <img
                src={userDetails.profileImage || "/default-avatar.png"}
                alt={userDetails.name}
                className="w-full h-full object-cover rounded-full border-4 border-slate-900"
              />
            </div>
            <span className="absolute bottom-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-green-500 border-4 border-slate-900 rounded-full animate-pulse shadow-lg"></span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Contact Info
          </h2>

          {/* Name */}
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
            {userDetails.name}
          </h3>

          {/* Details Card */}
          <div className="w-full bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
            <ul className="space-y-5 text-left">
              <li className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Name</span>
                <span className="text-white font-semibold text-right max-w-[60%] truncate">
                  {userDetails.name}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Email</span>
                <span className="text-white text-right max-w-[60%] truncate text-sm">
                  {userDetails.email}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Mobile</span>
                <span className="text-white">{userDetails.mobile || "—"}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverInfoPopUp;
