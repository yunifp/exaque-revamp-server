const repo = require("../repositories/articleTagRepository");


const createTag = async (data) => {
  const { name } = data;

  const existing = await repo.findTagByNameOrSlug(name, "");
  if (existing) {
    throw new Error("Nama tag sudah ada.");
  }

  
  return await repo.createTag({ name });
};

const getAllTags = async () => {
  return await repo.findAllTags();
};

const getTagById = async (id) => {
  const tag = await repo.findTagById(id);
  if (!tag) {
    throw new Error("Tag tidak ditemukan.");
  }
  return tag;
};


const updateTag = async (id, data) => {
  const { name } = data;

  
  const tagToUpdate = await repo.findTagById(id);
  if (!tagToUpdate) {
    throw new Error("Tag tidak ditemukan.");
  }

  
  tagToUpdate.name = name;

  
  await tagToUpdate.save();

  
  const updatedTagFromDB = await repo.findTagById(id);
  return updatedTagFromDB;
};

const deleteTag = async (id) => {
  const deletedRows = await repo.deleteTagById(id);
  if (deletedRows === 0) {
    throw new Error("Tag tidak ditemukan.");
  }
  return { message: "Tag berhasil dihapus." };
};

module.exports = {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
};
