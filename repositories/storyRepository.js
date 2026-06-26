const db = require("../models");
const { Story, User, StoryCategory, StoryTag } = db;

// Pilihan 'include' standar untuk mengambil relasi
const includeAssociations = [
  { model: User, as: "author", attributes: ["id", "name"] },
  { model: StoryCategory, as: "categories", through: { attributes: [] } },
  { model: StoryTag, as: "tags", through: { attributes: [] } },
];

const createStory = async (data, transaction) => {
  return await Story.create(data, { transaction });
};

const updateStory = async (id, data, transaction) => {
  return await Story.update(data, {
    where: { id },
    transaction,
  });
};

const findStoryById = async (id) => {
  return await Story.findByPk(id, {
    include: includeAssociations,
  });
};

const findStoryBySlug = async (slug) => {
  return await Story.findOne({
    where: { slug },
    include: includeAssociations,
  });
};

const deleteStoryById = async (id) => {
  return await Story.destroy({ where: { id } });
};

const findAllStories = async (options) => {
  return await Story.findAndCountAll(options);
};

module.exports = {
  createStory,
  updateStory,
  findStoryById,
  findStoryBySlug,
  deleteStoryById,
  findAllStories,
  includeAssociations,
};
