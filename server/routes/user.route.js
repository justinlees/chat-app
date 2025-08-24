const router = require("express").Router();

const {
  getUserDetails,
  getMessages,
  sendMessage,
  updateProfileImage,
  deleteProfileImage,
} = require("../controller/user.controller");
const { profileUpload, chatUpload } = require("../lib/cloudinary");
const verifyToken = require("../lib/verifyToken");
const checkSenderId = require("../lib/checkSenderId");

router.get("/:senderId", verifyToken, checkSenderId, getUserDetails);
router.patch(
  "/:senderId/profile",
  verifyToken,
  checkSenderId,
  deleteProfileImage
);
router.put(
  "/:senderId/profile",
  verifyToken,
  checkSenderId,
  profileUpload.single("profileImage"),
  updateProfileImage
);

router.get("/:senderId/:receiverId", verifyToken, checkSenderId, getMessages);
router.post(
  "/:senderId/:receiverId",
  verifyToken,
  chatUpload.single("image"),
  sendMessage
);

module.exports = router;
