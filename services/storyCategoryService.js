const repo = require("../repositories/storyCategoryRepository");

const createCategory = async (data) => {
  const { name } = data;

  const existing = await repo.findCategoryByNameOrSlug(name, "");
  if (existing) {
    throw new Error("Nama kategori sudah ada.");
  }

  
  return await repo.createCategory({ name });
};

const getAllCategories = async () => {
  return await repo.findAllCategories();
};

const getCategoryById = async (id) => {
  const category = await repo.findCategoryById(id);
  if (!category) {
    throw new Error("Kategori tidak ditemukan.");
  }
  return category;
};


const updateCategory = async (id, data) => {
  const { name } = data;

  
  const categoryToUpdate = await repo.findCategoryById(id);
  if (!categoryToUpdate) {
    throw new Error("Kategori tidak ditemukan.");
  }

  
  categoryToUpdate.name = name;

  
  await categoryToUpdate.save();

  
  const updatedCategoryFromDB = await repo.findCategoryById(id);

  return updatedCategoryFromDB;
};

const deleteCategory = async (id) => {
  const deletedRows = await repo.deleteCategoryById(id);
  if (deletedRows === 0) {
    throw new Error("Kategori tidak ditemukan.");
  }
  return { message: "Kategori berhasil dihapus." };
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
