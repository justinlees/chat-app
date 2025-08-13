import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatContacts from "../components/ChatContacts.jsx";

const User = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { senderId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${senderId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
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
      }
    };
    fetchUser();
  }, [senderId]);

  if (error)
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <h1 className="text-3xl font-bold">{error}</h1>
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
      <div className="flex items-center h-10 ">
        <h1>ChatMe</h1>
      </div>

      <div className="flex flex-1 bg-gray-600 overflow-hidden">
        <ChatContacts user={user} />
      </div>
    </div>
  );
};

export default User;
