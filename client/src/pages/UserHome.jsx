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
          `${import.meta.env.VITE_BASE_URL}/user/${senderId}`,
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
          setIsLoading(false);
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
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [senderId]);

  if (error)
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <h1 className="text-3xl font-bold">{error}</h1>
      </div>
    );

  if (isLoading)
    return (
      <div className="w-screen h-screen flex justify-center items-center gap-2">
        <div className="loader w-full top-1/2 right-1/2 "></div>
        <h1>Loading...</h1>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <h1 className="text-3xl font-bold">No Details Found</h1>
      </div>
    );

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="flex items-center h-12 bg-gray-900">
        <h1
          className="text-3xl p-6 text-gray-200 font-bold text-shadow-pink-800-lg "
          style={{
            fontFamily: "'Noto Sans', sans-serif",
            textShadow: "2px 2px  #3e6483ff",
          }}
        >
          ChatMe
        </h1>
      </div>

      <div className="flex flex-1 bg-gray-600 overflow-hidden">
        <ChatContacts user={user} />
      </div>
    </div>
  );
};

export default User;
