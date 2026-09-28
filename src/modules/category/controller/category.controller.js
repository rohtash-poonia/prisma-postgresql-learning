const { prisma } = require("../../../config/prisma");

const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name || !description || !image) {
      return res
        .status(400)
        .json({ error: "Name, description, and image are required" });
    }
    const existsingCategory = await prisma.category.findUnique({
      where: { name },
    });
    if (existsingCategory) {
      return res
        .status(400)
        .json({ error: "Category with this name already exists" });
    }
    const category = await prisma.category.create({
      data: {
        name,
        description,
        image,
      },
    });
    res
      .status(201)
      .json({
        success: true,
        message: "Category created successfully",
        category,
      });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res
      .status(200)
      .json({
        success: true,
        message: "Categories retrieved successfully",
        categories,
      });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Category retrieved successfully",
        category,
      });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, isActive } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        image,
        isActive,
      },
    });
    res
      .status(200)
      .json({
        success: true,
        message: "Category updated successfully",
        category,
      });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.delete({
      where: { id },
    });
    res
      .status(200)
      .json({
        success: true,
        message: "Category deleted successfully",
        category,
      });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
