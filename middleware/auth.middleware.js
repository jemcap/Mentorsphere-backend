import jwt from "jsonwebtoken";

const authVerification = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    console.log("Decoded User ID:", req.user.id);

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authVerification;
