import SearchContacts from "./SearchContacts.jsx";

import { useEffect, useState } from "react";

const ChatContacts = ({ user }) => {
  const [userContacts, setUserContacts] = useState([]);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/user/${
            user._id
          }`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.userContacts) {
          setUserContacts(data.userContacts);
        } else {
          setInfo("No contacts found");
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setInfo("Unable to fetch contacts");
      }
    };
    fetchContacts();
  }, [user._id]);

  return (
    <div className="flex w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* This ensures full height & proper layout */}
      <SearchContacts user={user} userContacts={userContacts} />
    </div>
  );
};

export default ChatContacts;
