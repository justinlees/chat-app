const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const tokenKey = Object.keys(req.cookies).find((key) =>
    key.startsWith("token_")
  );
  if (!tokenKey) return res.status(401).json({ message: "Token not found" });
  const token = req.cookies[tokenKey];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.senderId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
