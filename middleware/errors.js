function errorHandler(err, req, res, next) {
  if (typeof err === "string") {
    // Custom application error
    return res.status(400).json({ message: err });
  }

  if (err.name === "ValidationError") {
    // Mongoose validation error
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "UnauthorizedError") {
    // JWT authentication error
    return res.status(401).json({ message: "Token not valid" });
  }

  return res.status(500).json({ message: err.message });
}

module.exports = {
  errorHandler,
};
