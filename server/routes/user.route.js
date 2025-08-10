const router = require("express").Router();
const {
  getUserDetails,
  getMessages,
  sendMessage,
} = require("../controller/user.controller");

router.get("/:senderId", getUserDetails);
router.get("/:senderId/:receiverId", getMessages);
router.post("/:senderId/:receiverId", sendMessage);

module.exports = router;
