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
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.message === "Image Deleted") {
        setUserDetails(data.user);
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
          headers: {
            "Content-Type": "application/json",
          },
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
        setIsUploading(false);
        setIsProfile(false);
        setPreview(data.user.profileImage);
        alert("Profile Updated successfully");
      } else {
        alert("Failed to update profile image. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      alert("Failed to update profile image. Server Error.");
    }
  };
  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-evenly bg-white p-6 rounded-xl shadow-lg w-1/3 h-1/2">
          <figure className="flex w-24 h-24 border border-gray-300 rounded-full relative">
            <img
              src={preview || userDetails.profileImage}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
            <form
              method="PUT"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
              className="flex flex-col absolute bottom-0 right-[-10px]"
            >
              <label className="flex justify-center items-center cursor-pointer rounded-full w-8 h-8 bg-gray-800 text-gray-100">
                +
                <input
                  type="file"
                  name="profileImage"
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
              {isProfile && (
                <button
                  type="submit"
                  className="bg-gray-900 text-white p-2 absolute bottom-0 left-10 cursor-pointer hover:bg-gray-600 rounded-full"
                >
                  Upload
                </button>
              )}
            </form>
            {userDetails.profileImageId && (
              <form
                method="PATCH"
                onSubmit={handleDeleteProfile}
                className="absolute top-0 right-[-10px]"
              >
                <button
                  type="submit"
                  className="bg-gray-800 text-red-400 flex justify-center items-center p-1 rounded-full"
                >
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </form>
            )}
          </figure>
          <ul className="flex flex-col justify-evenly gap-4 text-gray-800">
            <li>
              <strong>Name:</strong> {userDetails.name}
            </li>
            <li>
              <strong>Email:</strong> {userDetails.email}
            </li>
            <li>
              <strong>Mobile:</strong> {userDetails.mobile}
            </li>
          </ul>
          <form method="POST" onSubmit={handleLogout}>
            <button type="submit" className="text-red-500 hover:text-red-900">
              LogOut &gt;
            </button>
          </form>

          <button
            onClick={onClose}
            className="border border-gray-400 hover:bg-blue-400 hover:text-white cursor-pointer shadow-md rounded p-2 text-center w-1/4 mt-2 transition-colors"
          >
            Close
          </button>
          {isUploading && <p className="text-xl text-red-500">Uploading...</p>}
        </div>
      </div>
    )
  );
};

export default UserInfoPopUp;
