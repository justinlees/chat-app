import { useState } from "react";

const UserInfoPopUp = ({ user, isOpen, onClose }) => {
  const [userDetails, setUserDetails] = useState(user);
  const [isProfile, setIsProfile] = useState(false);
  const [preview, setPreview] = useState(userDetails.profileImage);
  const [isUploading, setIsUploading] = useState(false);

  const handleDeleteProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/user/${
          userDetails._id
        }/profile`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.message === "Image Deleted") {
        setUserDetails(data.user);
        setPreview(null);
      } else {
        alert("Failed to delete profile image. Please try again.");
      }
    } catch (error) {
      alert("Failed to delete profile image. Please try again.");
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/logout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senderId: user._id }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.message === "logout successful") {
        window.location.href = "/login";
      } else {
        alert("Logout failed. No response");
      }
    } catch (error) {
      alert("Logout failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData();
    formData.append("profileImage", e.target.profileImage.files[0]);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/user/${
          user._id
        }/profile`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.message === "Image Updated") {
        setUserDetails(data.user);
        setPreview(data.user.profileImage);
        setIsProfile(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile image.");
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      alert("Server error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 rounded-2xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-2xl animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Header */}
        <div className="p-8 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Your Profile
          </h2>
        </div>

        {/* Profile Image Section */}
        <div className="flex justify-center -mt-8 relative">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full ring-4 ring-purple-500/50 shadow-2xl overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 p-1">
              <img
                src={
                  preview || userDetails.profileImage || "/default-avatar.png"
                }
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Upload Button */}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <label className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-lg transition transform hover:scale-110">
                <span className="material-symbols-outlined text-xl">
                  add_a_photo
                </span>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setIsProfile(true);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>

              {/* Upload Confirm Button */}
              {isProfile && (
                <button
                  type="submit"
                  disabled={isUploading}
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded-full shadow-lg transition-all"
                >
                  {isUploading ? "Uploading..." : "Save"}
                </button>
              )}
            </form>

            {/* Delete Button */}
            {userDetails.profileImageId && (
              <form
                onSubmit={handleDeleteProfile}
                className="absolute -top-2 -right-2"
              >
                <button
                  type="submit"
                  className="bg-red-600/90 hover:bg-red-700 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg transition transform hover:scale-110"
                  title="Remove profile picture"
                >
                  <span className="material-symbols-outlined text-lg">
                    delete
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* User Details */}
        <div className="px-8 py-6 text-center space-y-4">
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <ul className="space-y-4 text-left text-gray-300">
              <li className="flex justify-between">
                <span className="font-medium text-gray-400">Name</span>
                <span className="text-white font-semibold">
                  {userDetails.name}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-400">Email</span>
                <span className="text-white">{userDetails.email}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-400">Mobile</span>
                <span className="text-white">
                  {userDetails.mobile || "Not set"}
                </span>
              </li>
            </ul>
          </div>

          {/* Logout Button */}
          <form onSubmit={handleLogout} className="mt-6">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </form>
        </div>

        {/* Upload Status */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
            <div className="text-white text-lg font-medium flex items-center gap-3">
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              Uploading...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoPopUp;
