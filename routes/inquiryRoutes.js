const express = require("express");
const router = express.Router();
const inquiryController = require("../controllers/inquiryController");
const authenticate = require("../middleware/authenticate");
const adminOnly = require("../middleware/adminOnly");



router.post("/", inquiryController.createInquiry);



router.use(authenticate);
router.use(adminOnly);


router.get("/", inquiryController.getAllInquiries);


router.get("/:id", inquiryController.getInquiryById);


router.patch("/:id", inquiryController.updateInquiryStatus);


router.delete("/:id", inquiryController.deleteInquiry);

module.exports = router;
