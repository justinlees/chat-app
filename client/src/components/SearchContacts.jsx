import { useState, useEffect } from "react";
import UserInfoPopUp from "./UserInfoPopUp.jsx";
import { Link, NavLink, Outlet } from "react-router-dom";

const SearchContacts = ({ user, userContacts }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [receiver, setReceiver] = useState();
  const [isLoading, setIsLoading] = useState(true);
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
          `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/user/${
            user._id
          }?contact=${searchTerm}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.receiver) {
          setIsLoading(false);
          setReceiver(data.receiver);
        } else if (!data.receiver) {
          console.log("No contacts found");
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setReceiver();
      }
      setIsLoading(false);
    };
    fetchContacts();
  }, [searchTerm, user._id]);

  return (
    <div className="flex w-full h-full">
      {/* SideBar */}
      <div className="flex flex-col w-1/4 h-full bg-gray-900">
        <div className="bg-gray-800 flex items-center justify-between p-4 h-14">
          <h1 className="text-xl text-white">{user.name}</h1>
          <h1
            className="text-lg text-white hover:cursor-pointer"
            onClick={handleClick}
          >
            ...
          </h1>
        </div>
        <div className="flex flex-col p-4 gap-2 text-white h-full">
          <input
            type="search"
            name="contacts"
            placeholder="Search"
            className="border border-gray-700 rounded-xl p-2 text-white font-bold w-full bg-gray-800"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isLoading && (
            <div className="w-full h-full flex justify-center items-center gap-2">
              <div className="loader1 w-full top-1/2 right-1/2 "></div>
              <h1 className="text-white">Loading...</h1>
            </div>
          )}
          {receiver ? (
            <Link
              className="p-2 rounded hover:bg-gray-800 cursor-pointer filter-blur"
              to={`${receiver._id}`}
            >
              {receiver.name}
            </Link>
          ) : searchTerm ? (
            <p className="p-2">No contacts found</p>
          ) : null}
          <div className="flex flex-col gap-2 mt-2 overflow-y-auto">
            {userContacts?.map((contact) => (
              <NavLink
                to={`${contact._id}`}
                key={contact._id}
                className={({ isActive }) =>
                  isActive
                    ? "p-2 flex hover:bg-gray-600 bg-gray-800 text-lg rounded transition-colors"
                    : "p-2 flex hover:bg-gray-600 text-lg rounded transition-colors"
                }
              >
                {contact.name}
              </NavLink>
            ))}
          </div>
        </div>
        {userPopUp && (
          <UserInfoPopUp
            user={user}
            isOpen={userPopUp}
            onClose={() => setUserPopUp(false)}
          />
        )}
      </div>

      <div className="message-container flex w-full h-full bg-gray-100 relative">
        <Outlet />
      </div>
    </div>
  );
};

export default SearchContacts;
