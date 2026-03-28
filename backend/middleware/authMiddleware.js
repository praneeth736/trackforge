const jwt = require("jsonwebtoken");

const SECRET = "mysecretkey";

const protect = (req, res, next) => {
  try {
    console.log("🔐 Checking authentication...");

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("❌ No token provided");
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Format: Bearer token
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, SECRET);

    console.log("✅ Token verified:", decoded);

    req.user = decoded; // attach user info

    next(); // go to next step (controller)

  } catch (error) {
    console.log("❌ Token invalid");
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = protect;