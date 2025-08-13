const UserInfoPopUp = ({ user, isOpen, onClose }) => {
  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-evenly bg-white p-6 rounded-xl shadow-lg w-1/3 h-1/2">
          <figure className="w-24 h-24 border border-gray-300 rounded-full overflow-hidden">
            <img src="" alt="Profile" className="w-full h-full object-cover" />
          </figure>
          <ul className="flex flex-col justify-evenly gap-4 text-gray-800">
            <li>
              <strong>Name:</strong> {user.name}
            </li>
            <li>
              <strong>Email:</strong> {user.email}
            </li>
            <li>
              <strong>Mobile:</strong> {user.mobile}
            </li>
          </ul>
          <button
            onClick={onClose}
            className="border border-gray-400 hover:bg-blue-400 hover:text-white cursor-pointer shadow-md rounded p-2 text-center w-1/4 mt-2 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default UserInfoPopUp;
