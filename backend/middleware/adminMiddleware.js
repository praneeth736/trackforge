const adminOnly = (req, res, next) => {
  console.log("🔐 Checking admin access...");

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied: Admin only",
    });
  }

  console.log("✅ Admin access granted");
  next();
};

module.exports = adminOnly;