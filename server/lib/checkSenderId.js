const checkSenderId = (req, res, next) => {
  if (req.senderId !== req.params.senderId)
    return res.status(403).json({ message: "UnAuthorized request" });
  next();
};

module.exports = checkSenderId;
