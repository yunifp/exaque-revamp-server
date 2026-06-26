const storyService = require("../services/storyService");

const createStory = async (req, res) => {
  try {
    if (req.body.tags && typeof req.body.tags === "string") {
      req.body.tags = JSON.parse(req.body.tags);
    }
    if (req.body.categories && typeof req.body.categories === "string") {
      req.body.categories = JSON.parse(req.body.categories);
    }
    const data = { ...req.body, author_id: req.user.id };
    const newStory = await storyService.createStory(data, req.file);
    return res.success(newStory, "Kisah berhasil dibuat.", 201);
  } catch (error) {
    return res.error(error.message, 500);
  }
};

const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.tags && typeof req.body.tags === "string") {
      req.body.tags = JSON.parse(req.body.tags);
    }
    if (req.body.categories && typeof req.body.categories === "string") {
      req.body.categories = JSON.parse(req.body.categories);
    }
    const updatedStory = await storyService.updateStory(id, req.body, req.file);
    return res.success(updatedStory, "Kisah berhasil diperbarui.");
  } catch (error) {
    if (error.message.includes("tidak ditemukan")) {
      return res.error(error.message, 404);
    }
    return res.error(error.message, 500);
  }
};

const getAllStories = async (req, res) => {
  try {
    const stories = await storyService.getAllStories(req.query);
    return res.success(stories, "Kisah berhasil diambil.");
  } catch (error) {
    return res.error(error.message, 500);
  }
};

const getStoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const story = await storyService.getStoryBySlug(slug);
    return res.success(story, "Kisah berhasil diambil.");
  } catch (error) {
    if (error.message.includes("tidak ditemukan")) {
      return res.error(error.message, 404);
    }
    return res.error(error.message, 500);
  }
};

const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    await storyService.deleteStory(id);
    return res.success(null, "Kisah berhasil dihapus.");
  } catch (error) {
    if (error.message.includes("tidak ditemukan")) {
      return res.error(error.message, 404);
    }
    return res.error(error.message, 500);
  }
};

module.exports = {
  createStory,
  updateStory,
  getAllStories,
  getStoryBySlug,
  deleteStory,
};
