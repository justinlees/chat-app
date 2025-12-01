import { useState, useEffect } from "react";
import UserInfoPopUp from "./UserInfoPopUp.jsx";
import { Link, NavLink, Outlet } from "react-router-dom";

const SearchContacts = ({ user, userContacts }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [receiver, setReceiver] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [userPopUp, setUserPopUp] = useState(false);

  const handleClick = () => {
    console.log("User pop up");
    setUserPopUp(true);
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/user/${
            user._id
          }?contact=${searchTerm}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.receiver) {
          setReceiver(data.receiver);
        } else {
          setReceiver(null);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setReceiver(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContacts();
  }, [searchTerm, user._id]);

  return (
    <div className="flex w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <aside className="w-96 max-w-full bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="bg-black/50 backdrop-blur-xl border-b border-white/10 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">{user.name}</h2>
              <p className="text-green-400 text-xs font-medium">● Online</p>
            </div>
          </div>

          <button
            onClick={handleClick}
            className="text-gray-300 flex justify-center items-center hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-md"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <div className="px-3 space-y-1">
            {/* Search Result */}
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : receiver ? (
              <NavLink
                to={`${receiver._id}`}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                onClick={() => setSearchTerm("")}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {receiver.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{receiver.name}</p>
                  <p className="text-gray-400 text-sm">Click to start chat</p>
                </div>
              </NavLink>
            ) : searchTerm && !receiver ? (
              <div className="text-center py-10 text-gray-400">
                <p>No user found</p>
              </div>
            ) : null}

            {/* Regular Contacts */}
            {userContacts?.length > 0 ? (
              userContacts.map((contact) => (
                <NavLink
                  key={contact._id}
                  to={`${contact._id}`}
                  className={({ isActive }) =>
                    `flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50 shadow-lg"
                        : "hover:bg-white/10"
                    }`
                  }
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black/50 rounded-full"></span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-lg">
                      {contact.name}
                    </p>
                    <p className="text-gray-400 text-sm truncate">
                      {contact.email}
                    </p>
                  </div>
                </NavLink>
              ))
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg">No contacts yet</p>
                <p className="text-sm mt-2">Search above to find people!</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 relative bg-gradient-to-br from-gray-900/90 via-purple-900/50 to-slate-900/90 backdrop-blur-sm">
        <Outlet />
      </div>

      {/* User Info Popup */}
      {userPopUp && (
        <UserInfoPopUp
          user={user}
          isOpen={userPopUp}
          onClose={() => setUserPopUp(false)}
        />
      )}
    </div>
  );
};

export default SearchContacts;
