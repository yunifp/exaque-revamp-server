const express = require("express");
const router = express.Router();
const controller = require("../controllers/articleCategoryController");
const authenticate = require("../middleware/authenticate");
const adminOnly = require("../middleware/adminOnly");



router.get("/", controller.getAllCategories);


router.get("/:id", controller.getCategoryById);




router.post("/", authenticate, adminOnly, controller.createCategory);


router.put("/:id", authenticate, adminOnly, controller.updateCategory);


router.delete("/:id", authenticate, adminOnly, controller.deleteCategory);

module.exports = router;
