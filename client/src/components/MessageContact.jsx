import { useState, useEffect, useRef } from "react";
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
  const messageEnd = useRef(null);
  const handleClick = () => {
    console.log("User pop up");
    setUserPopUp(true);
  };

  useEffect(() => {
    const socket = io("http://localhost:5000");
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/user/${senderId}/${receiverId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.sender) {
          setSender(data.sender);
        }
        if (data.receiver) {
          setReceiver(data.receiver);
        }
        if (data.messages) {
          setUserMessages(data.messages);
        } else if (!data.messages) {
          setInfo("Start a conversation");
        } else {
          setError(data.message);
        }

        console.log(data.sender);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Unable to fetch user details");
      }
    };
    fetchUserDetails();

    socket.emit("join", senderId);

    socket.on("receiveMessage", (messageData) => {
      setUserMessages((prev) => [...prev, messageData]);
    });

    return () => {
      socket.off("receiveMessage"); // Clean up listener
    };
  }, [senderId, receiverId]);

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [userMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageData = {
      senderId: senderId,
      receiverId: receiverId,
      text: e.target.text.value,
      image: e.target.image.files[0],
    };

    try {
      const response = await fetch(
        `http://localhost:5000/user/${senderId}/${receiverId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messageData),
        }
      );
      const data = await response.json();
      if (data.message === "Message sent successfully") {
        e.target.reset();
      }
      messageEnd.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* ReceiverBar */}
      <div className="flex items-center justify-between h-14 p-4 bg-gray-800">
        <h1 className=" text-lg text-white">{receiver?.name}</h1>
        <h1
          className="text-lg text-white hover:cursor-pointer"
          onClick={handleClick}
        >
          ...
        </h1>
      </div>

      {/* Chat Container */}
      <div className="flex flex-col w-full h-full overflow-y-scroll p-2 gap-2">
        {userMessages?.map((msg) =>
          msg.senderId === senderId ? (
            <div className="max-w-2xl  flex flex-col ml-auto p-1" key={msg._id}>
              <h1 className="flex justify-center p-2 px-4 text-md mr-auto bg-gray-900 text-gray-200 rounded-2xl break-all whitespace-pre-wrap">
                {msg.text}
              </h1>
              <span className="text-xs text-gray-900 ml-auto">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          ) : (
            <div className="max-w-2xl flex flex-col mr-auto p-1" key={msg._id}>
              <h1 className="flex justify-center p-2 px-4 text-md mr-auto bg-gray-400 text-gray-900 rounded-2xl break-all whitespace-pre-wrap">
                {msg.text}
              </h1>
              <span className="text-xs text-gray-900 mr-auto">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          )
        )}
        <div ref={messageEnd} />
      </div>

      {/* Input Box */}
      <div className="flex items-center bg-gray-100 p-3 ">
        <form
          method="POST"
          className="flex items-center w-full h-16 gap-3"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {/* File Upload Button */}
          <label
            htmlFor="fileInput"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 cursor-pointer hover:bg-gray-300 transition"
          >
            +
            <input type="file" name="image" id="fileInput" className="hidden" />
          </label>

          {/* Message Input */}
          <input
            type="text"
            required
            placeholder="Type a message..."
            name="text"
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
          />

          {/* Send Button */}
          <button
            type="submit"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            ➤
          </button>
        </form>
      </div>

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
