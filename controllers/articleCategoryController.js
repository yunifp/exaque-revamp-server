const service = require("../services/articleCategoryService");


const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.error("Nama kategori wajib diisi.", 400);
    }
    const newCategory = await service.createCategory({ name });
    return res.success(newCategory, "Kategori berhasil dibuat.", 201);
  } catch (error) {
    if (error.message.includes("sudah ada")) {
      return res.error(error.message, 409); 
    }
    return res.error(error.message, 500);
  }
};


const getAllCategories = async (req, res) => {
  try {
    const categories = await service.getAllCategories();
    return res.success(categories, "Kategori berhasil diambil.");
  } catch (error) {
    return res.error(error.message, 500);
  }
};


const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await service.getCategoryById(id);
    return res.success(category, "Kategori berhasil diambil.");
  } catch (error) {
    if (error.message.includes("tidak ditemukan")) {
      return res.error(error.message, 404);
    }
    return res.error(error.message, 500);
  }
};


const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.error("Nama kategori wajib diisi.", 400);
    }
    const updatedCategory = await service.updateCategory(id, { name });
    return res.success(updatedCategory, "Kategori berhasil diperbarui.");
  } catch (error) {
    if (error.message.includes("tidak ditemukan")) {
      return res.error(error.message, 404);
    }
    return res.error(error.message, 500);
  }
};


const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await service.deleteCategory(id);
    return res.success(null, "Kategori berhasil dihapus.");
  } catch (error) {
    if (error.message.includes("tidak ditemukan")) {
      return res.error(error.message, 404);
    }
    return res.error(error.message, 500);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
