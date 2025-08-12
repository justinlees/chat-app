import { useState, useEffect } from "react";
import UserInfoPopUp from "./UserInfoPopUp.jsx";
import { Link, NavLink, Outlet } from "react-router-dom";

const SearchContacts = ({ user, userContacts }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [receiver, setReceiver] = useState();
  // const [showContact, setShowContact] = useState(false);

  const [userPopUp, setUserPopUp] = useState(false);
  const handleClick = () => {
    console.log("User pop up");
    setUserPopUp(true);
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/user/${user._id}?contact=${searchTerm}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        if (data.receiver) {
          setReceiver(data.receiver);
        } else if (!data.receiver) {
          console.log("No contacts found");
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setReceiver();
      }
      console.log("fetch Executed");
    };
    fetchContacts();
  }, [searchTerm, user._id]);

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-1/4">
        <div className="bg-gray-900 flex items-center justify-between p-2">
          <h1 className="text-lg text-white">{user.name}</h1>
          <h1
            className="text-lg text-white hover:cursor-pointer"
            onClick={handleClick}
          >
            ...
          </h1>
        </div>
        <div className="flex flex-col justify-center p-4 text-white">
          <input
            type="search"
            name="contacts"
            placeholder="Search"
            className="border border-gray-300 rounded p-2 text-gray-100 w-full mb-2"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {receiver ? (
            <Link
              className="mt-2 p-2 rounded hover:bg-gray-500 cursor-pointer filter-blur"
              to={`${receiver._id}`}
            >
              {receiver.name}
            </Link>
          ) : searchTerm ? (
            <p>No contacts found</p>
          ) : null}
          <div className="flex flex-col gap-2 mt-2 overflow-y-auto">
            {userContacts?.map((contact) => (
              <NavLink
                to={`${contact._id}`}
                key={contact._id}
                className={({ isActive }) =>
                  isActive
                    ? "p-2 hover:bg-gray-500 bg-gray-600 rounded"
                    : "p-2 hover:bg-gray-500 rounded"
                }
              >
                {contact.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {userPopUp && (
        <UserInfoPopUp
          user={user}
          isOpen={userPopUp}
          onClose={() => setUserPopUp(false)}
        />
      )}
      <div className="message-container w-full h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default SearchContacts;
