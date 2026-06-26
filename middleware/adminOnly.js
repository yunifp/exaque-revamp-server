"use strict";

const adminOnly = (req, res, next) => {
  
  const user = req.user;

  if (user && user.role === "admin") {
    
    return next();
  }

  if (user && user.role === "editor") {
    
    
    
  }

  
  return res.error("Forbidden: Anda tidak memiliki hak akses admin.", 403);
};

module.exports = adminOnly;
