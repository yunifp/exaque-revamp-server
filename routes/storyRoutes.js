const express = require("express");
const router = express.Router();
const controller = require("../controllers/storyController");
const authenticate = require("../middleware/authenticate");
const adminOnly = require("../middleware/adminOnly");
const upload = require("../middleware/uploadHandler");


router.get("/", controller.getAllStories);
router.get("/:slug", controller.getStoryBySlug);


router.post(
  "/",
  authenticate,
  adminOnly,
  upload.single("featured_image"),
  controller.createStory
);
router.put(
  "/:id",
  authenticate,
  adminOnly,
  upload.single("featured_image"),
  controller.updateStory
);
router.delete("/:id", authenticate, adminOnly, controller.deleteStory);

module.exports = router;
