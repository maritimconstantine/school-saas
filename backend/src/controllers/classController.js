const prisma = require("../config/db");

// Create class
const createClass = async (req, res) => {
  try {
    const { name, code, gradeId } = req.body;

    if (!name || !code || !gradeId) {
      return res.status(400).json({
        success: false,
        message: "Class name, code and grade are required"
      });
    }

    const grade = await prisma.grade.findUnique({
      where: { id: gradeId }
    });

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: "Grade not found"
      });
    }

    const existingClass = await prisma.schoolClass.findFirst({
      where: {
        OR: [
          { name },
          { code }
        ]
      }
    });

    if (existingClass) {
      return res.status(409).json({
        success: false,
        message: "Class name or code already exists"
      });
    }

    const schoolClass = await prisma.schoolClass.create({
      data: {
        name,
        code,
        gradeId
      },
      include: {
        grade: true
      }
    });

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      schoolClass
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create class"
    });
  }
};

// Get classes
const getClasses = async (req, res) => {
  try {
    const { gradeId } = req.query;

    const where = {
      isActive: true
    };

    if (gradeId) {
      where.gradeId = gradeId;
    }

    const classes = await prisma.schoolClass.findMany({
      where,
      include: {
        grade: true,
        _count: {
          select: {
            learners: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    });

    res.json({
      success: true,
      count: classes.length,
      classes
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve classes"
    });
  }
};

// Get single class
const getClass = async (req, res) => {
  try {
    const { id } = req.params;

    const schoolClass = await prisma.schoolClass.findUnique({
      where: { id },
      include: {
        grade: true,
        learners: {
          orderBy: {
            lastName: "asc"
          }
        }
      }
    });

    if (!schoolClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    res.json({
      success: true,
      schoolClass
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve class"
    });
  }
};

module.exports = {
  createClass,
  getClasses,
  getClass
};