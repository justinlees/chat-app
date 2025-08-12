import SearchContacts from "./SearchContacts.jsx";

import { useEffect, useState } from "react";

const ChatContacts = ({ user }) => {
  const [userContacts, setUserContacts] = useState([]);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${user._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
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
    <div className="bg-gray-800 w-full h-full">
      <SearchContacts user={user} userContacts={userContacts} />
    </div>
  );
};

export default ChatContacts;
