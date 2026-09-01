const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const inquiryRoutes = require("./inquiryRoutes");
const articleCategoryRoutes = require("./articleCategoryRoutes");
const storyCategoryRoutes = require("./storyCategoryRoutes");
const articleTagRoutes = require("./articleTagRoutes");
const articleRoutes = require("./articleRoutes");
const storyRoutes = require("./storyRoutes");


const chatController = require("../controllers/chatController");
const leadController = require("../controllers/leadController");

router.use("/auth", authRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/article-categories", articleCategoryRoutes);
router.use("/story-categories", storyCategoryRoutes);
router.use("/article-tags", articleTagRoutes);
router.use("/articles", articleRoutes);
router.use("/stories", storyRoutes);

router.post("/chat", chatController.handleChat);
router.post("/lead", leadController.handleLead);


module.exports = router;
