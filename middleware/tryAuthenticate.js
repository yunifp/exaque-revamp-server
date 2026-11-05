
const jwt = require("jsonwebtoken");




const tryAuthenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(); 
  }

  try {
    
    
    

    
    
    
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    
    
    req.user = decodedPayload; 
  } catch (error) {
    
    
    res.clearCookie("token", {
      domain: process.env.NODE_ENV === "production" ? ".exaque.com" : undefined,
      path: "/",
    });
  }

  next();
};

module.exports = tryAuthenticate;
