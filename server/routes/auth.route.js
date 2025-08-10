const router = require("express").Router();
const { signUp } = require("../controller/auth.controller");
const { login } = require("../controller/auth.controller");

router.post("/signUp", signUp);
router.post("/login", login);

module.exports = router;
