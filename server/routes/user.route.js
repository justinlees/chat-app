const router = require("express").Router();
const {
  getUserDetails,
  getMessages,
  sendMessage,
  updateProfileImage,
  deleteProfileImage,
} = require("../controller/user.controller");
const { profileUpload, chatUpload } = require("../lib/cloudinary");

router.get("/:senderId", getUserDetails);
router.patch("/:senderId/profile", deleteProfileImage);
router.put(
  "/:senderId/profile",
  profileUpload.single("profileImage"),
  updateProfileImage
);

router.get("/:senderId/:receiverId", getMessages);
router.post("/:senderId/:receiverId", chatUpload.single("image"), sendMessage);

module.exports = router;
