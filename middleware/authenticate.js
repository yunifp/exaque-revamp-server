const jwt = require("jsonwebtoken");
const db = require("../models");


const authenticate = async (req, res, next) => {
  try {
    
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: Token tidak ditemukan.",
      });
    }

    
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    const user = await db.User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] }, 
    });

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: User tidak ditemukan.",
      });
    }

    
    req.user = user;
    next(); 
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: Token tidak valid.",
      });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: Token kedaluwarsa.",
      });
    }
    
    return res.status(500).send({
      success: false,
      message: "Kesalahan server internal.",
      error: err.message,
    });
  }
};

module.exports = authenticate;
