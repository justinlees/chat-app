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
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.user) {
              setUser(data.user);
            }
            if (data.message === "User not found") {
              setError("User Does Not Exist");
            }
            if (data.message === "Internal server error") {
              setError("Failed to fetch user");
            }
          });
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch");
      }
    };
    fetchUser();
  }, [senderId]);
  return error ? (
    <div className="flex justify-center items-center w-screen h-screen">
      <h1 className="text-3xl font-bold">{error}</h1>
    </div>
  ) : user ? (
    <div className="flex flex-col w-full h-screen">
      <div>
        <h1>ChatMe</h1>
      </div>

      <div className="flex items-center justify-between w-full h-screen">
        <ChatContacts user={user} />
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center w-screen h-screen">
      <h1 className="text-3xl font-bold">No Details Found</h1>
    </div>
  );
};

export default User;
