const express = require("express");
const router = express.Router();
const controller = require("../controllers/articleTagController");
const authenticate = require("../middleware/authenticate");
const adminOnly = require("../middleware/adminOnly");


router.get("/", controller.getAllTags);
router.get("/:id", controller.getTagById);


router.post("/", authenticate, adminOnly, controller.createTag);
router.put("/:id", authenticate, adminOnly, controller.updateTag);
router.delete("/:id", authenticate, adminOnly, controller.deleteTag);

module.exports = router;
