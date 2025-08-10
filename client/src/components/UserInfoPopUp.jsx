import { useState } from "react";

const UserInfoPopUp = ({ user, isOpen, onClose }) => {
  return (
    isOpen && (
      <div className="flex items-center justify-center w-screen h-screen fixed top-0 left-0 ">
        <div className="flex flex-col items-center justify-evenly bg-white p-6 rounded shadow-lg w-1/3 h-1/2">
          <figure className="w-1/4 h-1/3 border border-black rounded-full">
            <img />
          </figure>
          <ul className="flex flex-col justify-evenly gap-4">
            <li>Name: {user.name}</li>
            <li>Email: {user.email}</li>
            <li>Mobile: {user.mobile}</li>
          </ul>
          <span
            onClick={onClose}
            className="border border-black hover:bg-blue-400 cursor-pointer shadow-md rounded p-2 text-center w-1/4 mt-2"
          >
            Close
          </span>
        </div>
      </div>
    )
  );
};

export default UserInfoPopUp;
