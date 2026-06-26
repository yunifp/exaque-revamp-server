const express = require("express");
const router = express.Router();
const controller = require("../controllers/articleController");
const authenticate = require("../middleware/authenticate");
const adminOnly = require("../middleware/adminOnly");
const upload = require("../middleware/uploadHandler"); 

router.get("/", controller.getAllArticles);
router.get("/:slug", controller.getArticleBySlug);

router.post(
  "/",
  authenticate,
  adminOnly,
  upload.fields([
    { name: "featured_image", maxCount: 1 },
    { name: "author_image", maxCount: 1 }
  ]), 
  controller.createArticle
);

router.put(
  "/:id",
  authenticate,
  adminOnly,
  upload.fields([
    { name: "featured_image", maxCount: 1 },
    { name: "author_image", maxCount: 1 }
  ]), 
  controller.updateArticle
);

router.delete("/:id", authenticate, adminOnly, controller.deleteArticle);

module.exports = router;