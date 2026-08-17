const prisma = require("../config/db");

// Create academic year
const createAcademicYear = async (req, res) => {
  try {
    const { name, startDate, endDate, isActive } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Name, start date and end date are required"
      });
    }

    const existingYear = await prisma.academicYear.findUnique({
      where: { name }
    });

    if (existingYear) {
      return res.status(409).json({
        success: false,
        message: "Academic year already exists"
      });
    }

    // If this year should become active,
    // deactivate all other years first.
    if (isActive) {
      await prisma.academicYear.updateMany({
        data: {
          isActive: false
        }
      });
    }

    const academicYear = await prisma.academicYear.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: Boolean(isActive)
      }
    });

    res.status(201).json({
      success: true,
      message: "Academic year created successfully",
      academicYear
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create academic year"
    });
  }
};

// Get all academic years
const getAcademicYears = async (req, res) => {
  try {
    const academicYears = await prisma.academicYear.findMany({
      orderBy: {
        startDate: "desc"
      }
    });

    res.json({
      success: true,
      count: academicYears.length,
      academicYears
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve academic years"
    });
  }
};

// Get single academic year
const getAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;

    const academicYear = await prisma.academicYear.findUnique({
      where: { id },
      include: {
        learners: {
          select: {
            id: true,
            admissionNumber: true,
            firstName: true,
            lastName: true,
            status: true
          }
        }
      }
    });

    if (!academicYear) {
      return res.status(404).json({
        success: false,
        message: "Academic year not found"
      });
    }

    res.json({
      success: true,
      academicYear
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve academic year"
    });
  }
};

// Set active academic year
const setActiveAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;

    const academicYear = await prisma.academicYear.findUnique({
      where: { id }
    });

    if (!academicYear) {
      return res.status(404).json({
        success: false,
        message: "Academic year not found"
      });
    }

    await prisma.$transaction([
      prisma.academicYear.updateMany({
        data: {
          isActive: false
        }
      }),

      prisma.academicYear.update({
        where: { id },
        data: {
          isActive: true
        }
      })
    ]);

    res.json({
      success: true,
      message: "Academic year activated successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to activate academic year"
    });
  }
};

module.exports = {
  createAcademicYear,
  getAcademicYears,
  getAcademicYear,
  setActiveAcademicYear
};