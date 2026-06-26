
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
    
    
    res.clearCookie("token");
  }

  next();
};

module.exports = tryAuthenticate;
