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
    <div className="w-full h-full flex flex-col">
      <div className="bg-gray-900 flex items-center justify-between p-2">
        <h1 className=" text-lg text-gray-200">{receiver?.name}</h1>
        <h1
          className="text-lg text-gray-200 hover:cursor-pointer"
          onClick={handleClick}
        >
          ...
        </h1>
      </div>
      <div className="w-full h-full bg-gray-200 p-2 gap-4 flex flex-col overflow-y-scroll">
        {userMessages?.map((msg) =>
          msg.senderId === senderId ? (
            <div
              className="max-w-lg min-w-24 flex flex-col bg-gray-800 text-gray-200 rounded-lg ml-auto p-1 flex-wrap"
              key={msg._id}
            >
              <h1 className="p-1 text-md mr-auto">{msg.text}</h1>
              <span className="text-xs text-gray-200 ml-auto">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          ) : (
            <div
              className="max-w-lg min-w-24 flex flex-col bg-gray-400 text-gray-900 rounded-lg mr-auto p-1 flex-wrap"
              key={msg._id}
            >
              <h1 className="p-1 text-md mr-auto">{msg.text}</h1>
              <span className="text-xs text-gray-200 ml-auto">
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
      <div className="flex w-full h-1/6">
        <form
          method="POST"
          className="w-full p-2 bg-gray-100"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
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
            className="border border-black rounded overflow-wrap"
          />
          <button
            type="submit"
            className="border border-black rounded w-1/16 cursor-pointer hover:bg-blue-400"
          >
            Send
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
