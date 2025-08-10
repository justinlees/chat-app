import { useState, useEffect } from "react";
import UserInfoPopUp from "./UserInfoPopUp.jsx";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const MessageContact = () => {
  const [userPopUp, setUserPopUp] = useState(false);
  const [userMessages, setUserMessages] = useState([]);
  const [sender, setSender] = useState();
  const [receiver, setReceiver] = useState();
  const [info, setInfo] = useState(null);
  const [error, setError] = useState();
  const { senderId, receiverId } = useParams();
  const handleClick = () => {
    console.log("User pop up");
    setUserPopUp(true);
  };

  useEffect(() => {
    const fetchUserMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/user/${senderId}/${receiverId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.messages) {
              setUserMessages(data.messages);
            } else if (!data.messages) {
              setInfo("Start a conversation");
            }
            if (data.sender) {
              setSender(data.sender);
            }
            if (data.receiver) {
              setReceiver(data.receiver);
            }
            if (data.message === "Internal server error") {
              setError("Unable to fetch messages");
            }
          });
      } catch (error) {
        setError("Unable to fetch messages");
      }
    };
    setInterval(() => fetchUserMessages(), 300);
  }, [senderId, receiverId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      senderId: senderId,
      receiverId: receiverId,
      text: e.target.text.value,
      image: e.target.image.value,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/user/${senderId}/${receiverId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Message sent successfully") {
            e.target.reset();
          }
        });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  return (
    <div className="w-full bg-gray-100">
      <div className="bg-gray-100 flex items-center justify-between p-2">
        <h1 className="p-2 text-lg text-gray-800">{receiver?.name}</h1>
        <h1
          className="text-lg text-gray-800 hover:cursor-pointer"
          onClick={handleClick}
        >
          ...
        </h1>
      </div>
      <div className="bg-gray-200 p-4">
        {userMessages?.map((msg) => (
          <h1 className="p-2 text-lg text-gray-800 align-right" key={msg._id}>
            {msg.text}
          </h1>
        ))}
      </div>
      <form
        method="POST"
        className="fixed bottom-0 w-full p-2 bg-gray-100"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          name="image"
          className="border border-black rounded"
        />
        <input
          type="text"
          required
          placeholder="send message"
          name="text"
          className="border border-black rounded"
        />
        <button
          type="submit"
          className="border border-black rounded w-1/16 cursor-pointer hover:bg-blue-400"
        >
          Send
        </button>
      </form>
      {userPopUp && (
        <UserInfoPopUp
          user={receiver}
          isOpen={userPopUp}
          onClose={() => setUserPopUp(false)}
        />
      )}
    </div>
  );
};

export default MessageContact;
