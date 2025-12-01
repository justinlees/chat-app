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
  const [isLoading, setIsLoading] = useState(true);

  const { senderId, receiverId } = useParams();
  const messageEnd = useRef(null);

  const handleClick = () => setUserPopUp(true);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BASE_URL || "http://localhost:5000");
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BASE_URL || "http://localhost:5000"
          }/user/${senderId}/${receiverId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.sender) setSender(data.sender);
        if (data.receiver) setReceiver(data.receiver);
        if (data.messages) {
          setUserMessages(data.messages);
          setIsLoading(false);
        } else setError(data.message);
      } catch (error) {
        console.error("Error:", error);
        setError("Unable to fetch chat");
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

    return () => socket.off("receiveMessage");
  }, [senderId, receiverId]);

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [userMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!textMessage && !docFile) return;
    setIsSending(true);

    const formData = new FormData();
    formData.append("senderId", senderId);
    formData.append("receiverId", receiverId);
    formData.append("text", textMessage || "");
    if (docFile) formData.append("image", docFile);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL || "http://localhost:5000"
        }/user/${senderId}/${receiverId}`,
        { method: "POST", body: formData, credentials: "include" }
      );
      const data = await response.json();
      if (data.message === "Message sent successfully") {
        setDocFile(null);
        setDocPreview(null);
        setTextMessage("");
        e.target.reset();
      }
    } catch (error) {
      console.error("Send error:", error);
      alert("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <p className="text-xl text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-purple-900/30 to-slate-900">
      {/* Chat Header */}
      <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={receiver?.profileImage || "/default-avatar.png"}
              alt={receiver?.name}
              className="w-12 h-12 rounded-full ring-4 ring-purple-500/50 shadow-lg object-cover"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-black rounded-full animate-pulse"></span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {receiver?.name || "Loading..."}
            </h2>
            <p className="text-sm text-gray-300">Active now</p>
          </div>
        </div>
        <button
          onClick={handleClick}
          className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 p-6 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          userMessages.map((msg) => (
            <div
              key={msg._id}
              className={`flex items-end gap-3 ${
                msg.senderId === senderId ? "flex-row-reverse" : ""
              }`}
            >
              <img
                src={
                  msg.senderId === senderId
                    ? sender?.profileImage
                    : receiver?.profileImage
                }
                alt=""
                className="w-9 h-9 rounded-full shadow-md"
              />

              <div
                className={`flex flex-col ${
                  msg.senderId === senderId ? "items-end" : "items-start"
                } max-w-lg`}
              >
                {msg.image && (
                  <div
                    className={`rounded-2xl overflow-hidden shadow-xl mb-1 ${
                      msg.senderId === senderId
                        ? "bg-gradient-to-br from-purple-600 to-pink-600 p-1"
                        : "bg-gray-700 p-1"
                    }`}
                  >
                    {msg.image.includes(".pdf") ? (
                      <div className="bg-white/10 backdrop-blur p-4 rounded-xl">
                        <object
                          data={msg.image}
                          type="application/pdf"
                          width="100%"
                          height="400px"
                          className="bg-gray-300 p-2"
                        ></object>
                      </div>
                    ) : (
                      <img
                        src={msg.image}
                        alt="sent"
                        className="max-w-xs rounded-xl"
                      />
                    )}
                  </div>
                )}

                {msg.text && (
                  <div
                    className={`px-5 py-3 rounded-3xl shadow-lg max-w-md break-words ${
                      msg.senderId === senderId
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-white/10 backdrop-blur text-white border border-white/20"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}

                <span className="text-xs text-gray-400 mt-1 px-2">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messageEnd} />
      </div>

      {/* Image / PDF Preview – now a floating card (not full-screen) */}
      {docPreview && (
        <div className="fixed inset-0 z-40 flex items-end justify-center pb-24 px-4 pointer-events-none">
          {/* pointer-events-none on overlay so clicks go through to the input bar */}
          <div className="relative max-w-lg w-full pointer-events-auto animate-in slide-in-from-bottom duration-300">
            {/* Card */}
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header with close button */}
              <div className="flex items-center justify-between p-3 border-b border-white/10">
                <p className="text-sm font-medium text-gray-300">Preview</p>
                <button
                  onClick={() => {
                    setDocFile(null);
                    setDocPreview(null);
                  }}
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
                >
                  <span className="material-symbols-outlined text-xl">
                    close
                  </span>
                </button>
              </div>

              {/* Content */}
              <div className="max-h-96 overflow-auto">
                {docPreview.endsWith(".pdf") ? (
                  <object
                    data={docPreview}
                    type="application/pdf"
                    className="w-full h-96 bg-gray-800"
                  />
                ) : (
                  <img
                    src={docPreview}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                )}
              </div>

              {/* Footer hint */}
              <div className="p-3 text-center text-xs text-gray-400 border-t border-white/10">
                Tap Send to share • You can still type or add text
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="bg-black/40 backdrop-blur-xl border-t border-white/10 p-4"
      >
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <label className="cursor-pointer text-gray-300 hover:text-white transition">
            <span className="material-symbols-outlined text-3xl">
              attach_file
            </span>
            <input
              type="file"
              name="image"
              className="hidden"
              accept="image/*,.pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setDocFile(file);
                  setDocPreview(URL.createObjectURL(file));
                }
              }}
            />
          </label>

          <input
            type="text"
            placeholder="Type a message..."
            value={textMessage || ""}
            onChange={(e) => setTextMessage(e.target.value)}
            className="flex-1 bg-white/10 backdrop-blur border border-white/20 rounded-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />

          <button
            type="submit"
            disabled={isSending || (!textMessage && !docFile)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition transform hover:scale-110 disabled:scale-100"
          >
            {isSending ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span className="material-symbols-outlined">send</span>
            )}
          </button>
        </div>
      </form>

      {/* Receiver Info Popup */}
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
