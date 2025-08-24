const router = require("express").Router();
const {
  signUp,
  login,
  loginGet,
  logout,
} = require("../controller/auth.controller");
const verifyToken = require("../lib/verifyToken");

router.post("/signUp", signUp);
router.get("/login", loginGet);
router.post("/login", login);
router.post("/logout", verifyToken, logout);

module.exports = router;
