import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import ReceiverInfoPopUp from "./ReceiverInfoPopUp.jsx";

const MessageContact = () => {
  const [userPopUp, setUserPopUp] = useState(false);

  const [userMessages, setUserMessages] = useState([]);
  const [sender, setSender] = useState();
  const [receiver, setReceiver] = useState();

  const [info, setInfo] = useState(null);
  const [error, setError] = useState();

  const [docPreview, setDocPreview] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [textMessage, setTextMessage] = useState(null);
  const [isSending, setIsSending] = useState(false);

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
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Unable to fetch user details");
      }
    };
    fetchUserDetails();

    const roomId =
      senderId < receiverId
        ? `${senderId}-${receiverId}`
        : `${receiverId}-${senderId}`;

    socket.emit("join", roomId);

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
    setIsSending(true);

    const messageData = {
      senderId: senderId,
      receiverId: receiverId,
      text: textMessage,
      image: docFile,
    };

    const formData = new FormData();
    formData.append("senderId", senderId);
    formData.append("receiverId", receiverId);
    formData.append("text", messageData.text);
    formData.append("image", messageData.image);

    try {
      const response = await fetch(
        `http://localhost:5000/user/${senderId}/${receiverId}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.message === "Message sent successfully") {
        setDocFile(null);
        setDocPreview(null);
        setTextMessage(null);
        setIsSending(false);
        e.target.reset();
      }
      messageEnd.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
      setIsSending(false);
    }
  };

  if (error) {
    return (
      <div className="text-3xl flex justify-center items-center">{error}</div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* ReceiverBar */}
      <div className="flex items-center justify-between h-14 p-4 bg-gray-800">
        <div className="flex items-center gap-2">
          <img
            src={receiver?.profileImage}
            className="w-12 h-12 rounded-full"
          />
          <h1 className=" text-lg text-white">{receiver?.name}</h1>
        </div>

        <h1
          className="text-lg text-white hover:cursor-pointer"
          onClick={handleClick}
        >
          ...
        </h1>
      </div>

      {/* Chat Container */}
      <div className="flex flex-col w-full h-full overflow-y-scroll p-2 gap-2 relative">
        {userMessages?.map((msg) =>
          msg.senderId === senderId ? (
            <div className="max-w-2xl flex flex-col ml-auto p-1" key={msg._id}>
              <img
                src={sender.profileImage}
                className="w-10 h-10 object-cover rounded-full ml-auto"
              />
              <div className="max-w-2xl flex flex-col ml-auto p-1">
                {msg.image !== "undefined" ? <img src={msg.image} /> : null}

                {msg.text && (
                  <h1 className="flex justify-center p-2 px-4 text-md mr-auto bg-gray-900 text-gray-200 rounded-2xl break-all whitespace-pre-wrap">
                    {msg.text}
                  </h1>
                )}

                <span className="text-xs text-gray-900 ml-auto">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl flex flex-col mr-auto p-1" key={msg._id}>
              <img
                src={receiver.profileImage}
                className="w-10 h-10 object-cover rounded-full"
              />
              <div className="max-w-2xl flex flex-col mr-auto p-1">
                {msg.image !== "undefined" ? <img src={msg.image} /> : null}
                {msg.text && (
                  <h1 className="flex justify-center p-2 px-4 text-md mr-auto bg-gray-400 text-gray-900 rounded-2xl break-all whitespace-pre-wrap">
                    {msg.text}
                  </h1>
                )}

                <span className="text-xs text-gray-900 mr-auto">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>
          )
        )}
        {isSending && (
          <div className="loader w-full h-full absoulte top-1/2 right-1/2"></div>
        )}
        {docPreview && (
          <div className="fixed top-1/2 right-10 transform -translate-y-1/2 bg-white shadow-lg border border-gray-300 rounded-lg w-80 z-50">
            <div className="flex justify-between items-center p-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Image Preview
              </span>
              <button
                onClick={() => {
                  setDocFile(null);
                  setDocPreview(null);
                }}
                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>
            <div className="p-2">
              <img
                src={docPreview}
                alt="Preview"
                className="w-full h-auto rounded-md object-contain"
              />
            </div>
          </div>
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
            <input
              type="file"
              name="image"
              id="fileInput"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setDocFile(file);
                  setDocPreview(URL.createObjectURL(file));
                }
                e.target.value = "";
              }}
            />
          </label>

          {/* Message Input */}
          <input
            type="text"
            placeholder="Type a message..."
            name="text"
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
            onChange={(e) => {
              setTextMessage(e.target.value);
            }}
          />

          {/* Send Button */}
          <button
            type={textMessage || docFile !== null ? "submit" : "button"}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            ➤
          </button>
        </form>
      </div>

      {userPopUp && (
        <ReceiverInfoPopUp
          userDetails={receiver}
          isOpen={userPopUp}
          onClose={() => setUserPopUp(false)}
        />
      )}
    </div>
  );
};

export default MessageContact;
