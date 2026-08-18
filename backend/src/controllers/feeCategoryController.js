const prisma = require("../config/db");

// Create fee category
const createFeeCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Fee category name is required"
      });
    }

    const existing = await prisma.feeCategory.findUnique({
      where: { name }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Fee category already exists"
      });
    }

    const category = await prisma.feeCategory.create({
      data: {
        name,
        description
      }
    });

    res.status(201).json({
      success: true,
      message: "Fee category created successfully",
      category
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create fee category"
    });
  }
};

// Get categories
const getFeeCategories = async (req, res) => {
  try {
    const categories = await prisma.feeCategory.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        name: "asc"
      }
    });

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve fee categories"
    });
  }
};

module.exports = {
  createFeeCategory,
  getFeeCategories
};