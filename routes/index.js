const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const inquiryRoutes = require("./inquiryRoutes");
const articleCategoryRoutes = require("./articleCategoryRoutes");
const storyCategoryRoutes = require("./storyCategoryRoutes");
const articleTagRoutes = require("./articleTagRoutes");
const articleRoutes = require("./articleRoutes");
const storyRoutes = require("./storyRoutes");


router.use("/auth", authRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/article-categories", articleCategoryRoutes);
router.use("/story-categories", storyCategoryRoutes);
router.use("/article-tags", articleTagRoutes);
router.use("/articles", articleRoutes);
router.use("/stories", storyRoutes);





module.exports = router;
