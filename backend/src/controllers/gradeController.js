const prisma = require("../config/db");

// Create grade
const createGrade = async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Grade name and code are required"
      });
    }

    const existingGrade = await prisma.grade.findFirst({
      where: {
        OR: [
          { name },
          { code }
        ]
      }
    });

    if (existingGrade) {
      return res.status(409).json({
        success: false,
        message: "Grade name or code already exists"
      });
    }

    const grade = await prisma.grade.create({
      data: {
        name,
        code
      }
    });

    res.status(201).json({
      success: true,
      message: "Grade created successfully",
      grade
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create grade"
    });
  }
};

// Get grades
const getGrades = async (req, res) => {
  try {
    const grades = await prisma.grade.findMany({
      where: {
        isActive: true
      },
      include: {
        classes: {
          where: {
            isActive: true
          },
          orderBy: {
            name: "asc"
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    });

    res.json({
      success: true,
      count: grades.length,
      grades
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve grades"
    });
  }
};

// Get grade
const getGrade = async (req, res) => {
  try {
    const { id } = req.params;

    const grade = await prisma.grade.findUnique({
      where: { id },
      include: {
        classes: true,
        learners: {
          select: {
            id: true,
            admissionNumber: true,
            firstName: true,
            middleName: true,
            lastName: true,
            status: true
          }
        }
      }
    });

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: "Grade not found"
      });
    }

    res.json({
      success: true,
      grade
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve grade"
    });
  }
};

module.exports = {
  createGrade,
  getGrades,
  getGrade
};