const prisma = require("../config/db");

// Create fee structure
const createFeeStructure = async (req, res) => {
  try {
    const {
      academicYearId,
      gradeId,
      feeCategoryId,
      amount
    } = req.body;

    if (
      !academicYearId ||
      !gradeId ||
      !feeCategoryId ||
      amount === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Academic year, grade, fee category and amount are required"
      });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount cannot be negative"
      });
    }

    const feeStructure =
      await prisma.feeStructure.create({
        data: {
          academicYearId,
          gradeId,
          feeCategoryId,
          amount: Number(amount)
        },

        include: {
          academicYear: true,
          grade: true,
          feeCategory: true
        }
      });

    res.status(201).json({
      success: true,
      message: "Fee structure created successfully",
      feeStructure
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create fee structure"
    });
  }
};

// Get fee structures
const getFeeStructures = async (req, res) => {
  try {
    const {
      academicYearId,
      gradeId
    } = req.query;

    const where = {};

    if (academicYearId) {
      where.academicYearId = academicYearId;
    }

    if (gradeId) {
      where.gradeId = gradeId;
    }

    const structures =
      await prisma.feeStructure.findMany({
        where,

        include: {
          academicYear: true,
          grade: true,
          feeCategory: true
        },

        orderBy: {
          createdAt: "desc"
        }
      });

    res.json({
      success: true,
      feeStructures: structures
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to retrieve fee structures"
    });
  }
};

// Get total fees for grade
const getGradeFeeTotal = async (req, res) => {
  try {
    const {
      academicYearId,
      gradeId
    } = req.query;

    if (!academicYearId || !gradeId) {
      return res.status(400).json({
        success: false,
        message:
          "Academic year and grade are required"
      });
    }

    const structures =
      await prisma.feeStructure.findMany({
        where: {
          academicYearId,
          gradeId
        },

        include: {
          feeCategory: true
        }
      });

    const total = structures.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    res.json({
      success: true,
      total,
      breakdown: structures
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to calculate fee total"
    });
  }
};

module.exports = {
  createFeeStructure,
  getFeeStructures,
  getGradeFeeTotal
};