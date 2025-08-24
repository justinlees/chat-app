const router = require("express").Router();
const { signUp, login, logout } = require("../controller/auth.controller");
const verifyToken = require("../lib/verifyToken");

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/logout", verifyToken, logout);

module.exports = router;
