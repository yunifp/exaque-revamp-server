const service = require("../services/articleTagService");


const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.error("Nama tag wajib diisi.", 400);
    }
    const newTag = await service.createTag({ name });
    return res.success(newTag, "Tag berhasil dibuat.", 201);
  } catch (error) {
    if (error.message.includes("sudah ada")) {
      return res.error(error.message, 409); 
    }
    return res.error(error.message, 500);
  }
};


const getAllTags = async (req, res) => {
  try {
    const tags = await service.getAllTags();
    return res.success(tags, "Tag berhasil diambil.");
  } catch (error) {
    return res.error(error.message, 500);
  }
};


const getTagById = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await service.getTagById(id);
    return res.success(tag, "Tag berhasil diambil.");
  } catch (error) {
    if (error.message.includes("tidak ditemukan")) {
      return res.error(error.message, 404);
    }
    return res.error(error.message, 500);
  }
};


const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.error("Nama tag wajib diisi.", 400);
    }
    const updatedTag = await service.updateTag(id, { name });
    return res.success(updatedTag, "Tag berhasil diperbarui.");
  } catch (error) {
    if (error.message.includes("tidak ditemukan")) {
      return res.error(error.message, 404);
    }
    return res.error(error.message, 500);
  }
};


const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    await service.deleteTag(id);
    return res.success(null, "Tag berhasil dihapus.");
  } catch (error) {
    if (error.message.includes("tidak ditemukan")) {
      return res.error(error.message, 404);
    }
    return res.error(error.message, 500);
  }
};

module.exports = {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
};
