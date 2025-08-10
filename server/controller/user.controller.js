const User = require("../models/user.model");
const Message = require("../models/message.model");

const getUserDetails = async (req, res) => {
  try {
    console.log("fetching User Details");
    const { senderId } = req.params;
    const searchTerm = req.query.contact || "";

    const user = await User.findById({ _id: senderId }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User Found");

    const userMessages = await Message.find({
      $or: [{ senderId: senderId }, { receiverId: senderId }],
    });

    console.log("Messages Found");

    const receiver = await User.findOne({ email: searchTerm }).select(
      "-password"
    );

    console.log(searchTerm);

    return res.status(200).json({ user, userMessages, receiver });
  } catch (error) {
    console.error("Error in fetching user:", error);
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
  const { senderId, receiverId, text, image } = req.body;
  try {
    const userMessages = await Message.create({
      senderId,
      receiverId,
      text,
      image,
    });
    if (!userMessages) {
      return res.status(500).json({ message: "Failed to send message" });
    }

    console.log("Message sent successfully");
    return res
      .status(201)
      .json({ message: "Message sent successfully", userMessages });
  } catch (error) {
    console.error("Error in sending message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getUserDetails, getMessages, sendMessage };
