const jwt = require("jsonwebtoken");

const guestOnly = (req, res, next) => {
  try {
    
    const token = req.cookies.token;

    if (!token) {
      
      return next();
    }

    
    
    jwt.verify(token, process.env.JWT_SECRET);

    
    
    return res.status(403).send({
      success: false,
      message: "Forbidden: Anda sudah login.",
    });
  } catch (err) {
    
    
    next();
  }
};

module.exports = guestOnly;
