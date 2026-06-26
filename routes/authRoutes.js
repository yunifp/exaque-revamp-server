const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticate = require("../middleware/authenticate"); 
const guestOnly = require("../middleware/guestOnly"); 


router.post("/login", guestOnly, authController.login);


router.post("/logout", authenticate, authController.logout);


router.get("/me", authenticate, authController.getMyProfile);
router.post("/forgot-password", guestOnly, authController.forgotPassword);
router.post("/reset-password/:token", guestOnly, authController.resetPassword);
module.exports = router;
