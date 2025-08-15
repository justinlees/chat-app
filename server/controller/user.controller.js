const User = require("../models/user.model");
const Message = require("../models/message.model");
const { cloudinary } = require("../lib/cloudinary");

const getUserDetails = async (req, res) => {
  try {
    console.log("fetching User Details");
    const { senderId } = req.params;

    // Search term from query param
    const searchTerm = req.query.contact || "";

    const user = await User.findById({ _id: senderId }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Finding the receiver from the search term
    const receiver = await User.findOne({ email: searchTerm }).select(
      "-password"
    );

    //Extracting the messages related to the user
    const userMessages = await Message.find({
      $or: [{ senderId: senderId }, { receiverId: senderId }],
    });

    /*
      if no messages found, return user,userMessages,receiver
      (handled in the frontend for no messages and no receiver)
    */
    if (!userMessages) {
      return res.status(200).json({ user, userMessages, receiver });
    }

    // Extracting unique Ids from the messages that are related to the currUser
    const uniqueIds = [
      ...new Set(
        userMessages?.map((msg) =>
          msg.senderId.toString() !== senderId ? msg.senderId : msg.receiverId
        )
      ),
    ];

    //Fetching user Contacts based on the unique Ids
    const userContacts = await User.find(
      { _id: { $in: uniqueIds } },
      { _id: 1, name: 1 }
    ).select("-password");

    console.log("Details fetched successfully");

    return res.status(200).json({ user, userContacts, receiver });
  } catch (error) {
    console.error("Error in fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfileImage = async (req, res) => {
  const { senderId } = req.params;
  const file = req.file;
  try {
    const user = await User.findById(senderId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      user.profileImage !==
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" &&
      user.profileImageId !== null
    ) {
      await cloudinary.uploader.destroy(user.profileImageId);
    }

    const { path, filename } = file;

    user.profileImage = path;
    user.profileImageId = filename;
    await user.save();

    return res.status(200).json({ message: "Image Updated", user });
  } catch (error) {
    return res.status(500).json({ message: "Image Not uploaded", error });
  }
};

const deleteProfileImage = async (req, res) => {
  const { senderId } = req.params;
  const defaultImage =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  try {
    const user = await User.findById(senderId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profileImage !== defaultImage && user.profileImageId !== null) {
      await cloudinary.uploader.destroy(user.profileImageId);
    }
    user.profileImage = defaultImage;
    user.profileImageId = null;
    await user.save();
    return res.status(200).json({ message: "Image Deleted", user });
  } catch (error) {
    console.error("Error in deleting profile image:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  const { senderId } = req.params;
  const { receiverId } = req.params;

  try {
    const sender = await User.findOne({ _id: senderId }).select("-password");
    const receiver = await User.findOne({ _id: receiverId }).select(
      "-password"
    );

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });
    return res.status(200).json({ sender, messages, receiver });
  } catch (error) {
    console.error("Error in fetching messages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  const { senderId, receiverId, text } = req.body;
  let image = null;
  let imageId = null;
  if (req.file) {
    const file = req.file;
    image = file.path;
    imageId = file.filename;
  }

  try {
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image,
      imageId,
    });
    if (!newMessage) {
      return res.status(500).json({ message: "Failed to send message" });
    }

    console.log("Message sent successfully");

    const io = req.app.get("io");
    const roomId =
      senderId < receiverId
        ? `${senderId}-${receiverId}`
        : `${receiverId}-${senderId}`;

    io.to(roomId).emit("receiveMessage", newMessage);

    return res
      .status(201)
      .json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error("Error in sending message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUserDetails,
  getMessages,
  sendMessage,
  updateProfileImage,
  deleteProfileImage,
};
