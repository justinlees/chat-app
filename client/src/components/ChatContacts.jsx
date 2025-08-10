import SearchContacts from "./SearchContacts.jsx";

import { useState } from "react";

const ChatContacts = ({ user }) => {
  return (
    <div className="bg-gray-800 w-full h-full">
      <SearchContacts user={user} />
    </div>
  );
};

export default ChatContacts;
