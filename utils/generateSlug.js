"use strict";

// Fungsi helper untuk slugify
const generateSlug = (title) => {
  if (!title) return null; // Safety check
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

module.exports = generateSlug;
