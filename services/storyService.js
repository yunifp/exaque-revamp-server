const fs = require("fs");
const path = require("path");
const db = require('../models');
const storyRepo = require("../repositories/storyRepository");
const storyTagRepo = require("../repositories/storyTagRepository");
const { processImageToWebP } = require("../utils/imageProcessor");
const generateSlug = require("../utils/generateSlug");
const { Op } = require("sequelize");


const handleTags = async (tagNames, transaction) => {
  const tagIds = [];
  if (!tagNames || tagNames.length === 0) {
    return tagIds;
  }
  for (const tagName of tagNames) {
    const tag = await storyTagRepo.findOrCreateTag(tagName, transaction);
    tagIds.push(tag.id);
  }
  return tagIds;
};

const createStory = async (data, file) => {
  const t = await db.sequelize.transaction();
  try {
    
    const slug = generateSlug(data.title);
    if (!slug) {
      throw new Error("Title tidak valid atau kosong.");
    }

    const storyData = {
      ...data,
      author_id: data.author_id,
      slug: slug, 
    };

    if (file) {
      const webpPath = await processImageToWebP(file.buffer);
      storyData.featured_image_url = webpPath;
    }

    
    const newStory = await storyRepo.createStory(storyData, t);

    if (data.categories && data.categories.length > 0) {
      await newStory.setCategories(data.categories, { transaction: t });
    }
    const tagIds = await handleTags(data.tags, t);
    if (tagIds.length > 0) {
      await newStory.setTags(tagIds, { transaction: t });
    }
    await t.commit();
    return await storyRepo.findStoryById(newStory.id);
  } catch (error) {
    await t.rollback();
    throw new Error(`Gagal membuat kisah: ${error.message}`);
  }
};

const updateStory = async (id, data, file) => {
  const t = await db.sequelize.transaction();
  let oldImagePath = null;
  try {
    const storyToUpdate = await storyRepo.findStoryById(id);
    if (!storyToUpdate) {
      throw new Error("Kisah tidak ditemukan.");
    }

    const storyData = { ...data };

    
    if (data.title && data.title !== storyToUpdate.title) {
      storyData.slug = generateSlug(data.title);
    }

    if (file) {
      oldImagePath = storyToUpdate.featured_image_url;
      const webpPath = await processImageToWebP(file.buffer);
      storyData.featured_image_url = webpPath;
    }

    
    await storyRepo.updateStory(id, storyData, t);

    if (data.categories) {
      await storyToUpdate.setCategories(data.categories, { transaction: t });
    }
    if (data.tags) {
      const tagIds = await handleTags(data.tags, t);
      await storyToUpdate.setTags(tagIds, { transaction: t });
    }
    await t.commit();
    if (oldImagePath) {
      try {
        const fullOldPath = path.join(__dirname, "../", oldImagePath);
        if (fs.existsSync(fullOldPath)) {
          fs.unlinkSync(fullOldPath);
        }
      } catch (deleteError) {
        console.error(
          `Gagal menghapus file lama (${oldImagePath}):`,
          deleteError.message
        );
      }
    }
    return await storyRepo.findStoryById(id);
  } catch (error) {
    await t.rollback();
    throw new Error(`Gagal memperbarui kisah: ${error.message}`);
  }
};

const getAllStories = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt", 
    order = "DESC",
    status,
    search, 
  } = queryParams;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  const where = {};
  if (status) {
    where.status = status;
  }

  if (search) {
    const { Op } = require("sequelize");
    where.title = { [Op.like]: `%${search}%` };
  }

  const options = {
    where, 
    limit: parseInt(limit),
    offset,
    order: [[sort, order]],
    include: storyRepo.includeAssociations,
    distinct: true,
  };

  const { count, rows } = await storyRepo.findAllStories(options);
  
  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    data: rows,
  };
};

const getStoryBySlug = async (slug) => {
  const story = await storyRepo.findStoryBySlug(slug);
  if (!story || story.status !== "published") {
    throw new Error("Kisah tidak ditemukan.");
  }
  return story;
};

const deleteStory = async (id) => {
  const storyToDelete = await storyRepo.findStoryById(id);
  if (!storyToDelete) {
    throw new Error("Kisah tidak ditemukan.");
  }
  const oldImagePath = storyToDelete.featured_image_url;
  const deletedRows = await storyRepo.deleteStoryById(id);
  if (deletedRows === 0) {
    throw new Error("Gagal menghapus kisah dari database.");
  }
  if (oldImagePath) {
    try {
      const fullOldPath = path.join(__dirname, "../", oldImagePath);
      if (fs.existsSync(fullOldPath)) {
        fs.unlinkSync(fullOldPath);
      }
    } catch (deleteError) {
      console.error(
        `Gagal menghapus file lama (${oldImagePath}):`,
        deleteError.message
      );
    }
  }
  return { message: "Kisah berhasil dihapus." };
};

module.exports = {
  createStory,
  updateStory,
  getAllStories,
  getStoryBySlug,
  deleteStory,
};
