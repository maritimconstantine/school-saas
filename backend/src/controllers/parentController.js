const prisma = require("../config/db");

// Create parent
const createParent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      alternativePhone,
      email,
      nationalId,
      address,
      occupation,
      emergencyContact,
      notes
    } = req.body;

    if (!firstName || !lastName || !phone) {
      return res.status(400).json({
        success: false,
        message: "First name, last name and phone are required"
      });
    }

    if (nationalId) {
      const existingParent = await prisma.parent.findUnique({
        where: {
          nationalId
        }
      });

      if (existingParent) {
        return res.status(409).json({
          success: false,
          message: "A parent with this national ID already exists"
        });
      }
    }

    const parent = await prisma.parent.create({
      data: {
        firstName,
        lastName,
        phone,
        alternativePhone,
        email,
        nationalId,
        address,
        occupation,
        emergencyContact,
        notes
      }
    });

    res.status(201).json({
      success: true,
      message: "Parent registered successfully",
      parent
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to register parent"
    });
  }
};

// Get parents
const getParents = async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 20
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.min(Math.max(Number(limit), 1), 100);

    const where = {};

    if (search) {
      where.OR = [
        {
          firstName: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          lastName: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          phone: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          email: {
            contains: search,
            mode: "insensitive"
          }
        }
      ];
    }

    const [parents, total] = await prisma.$transaction([
      prisma.parent.findMany({
        where,
        include: {
          learners: {
            include: {
              learner: {
                select: {
                  id: true,
                  admissionNumber: true,
                  firstName: true,
                  lastName: true,
                  status: true
                }
              }
            }
          }
        },
        orderBy: {
          lastName: "asc"
        },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize
      }),

      prisma.parent.count({
        where
      })
    ]);

    res.json({
      success: true,
      parents,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve parents"
    });
  }
};

// Get single parent
const getParent = async (req, res) => {
  try {
    const { id } = req.params;

    const parent = await prisma.parent.findUnique({
      where: { id },
      include: {
        learners: {
          include: {
            learner: {
              include: {
                grade: true,
                schoolClass: true,
                academicYear: true
              }
            }
          }
        }
      }
    });

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found"
      });
    }

    res.json({
      success: true,
      parent
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve parent"
    });
  }
};

// Link parent to learner
const linkParentToLearner = async (req, res) => {
  try {
    const {
      parentId,
      learnerId,
      relationship,
      isPrimary = false
    } = req.body;

    if (!parentId || !learnerId || !relationship) {
      return res.status(400).json({
        success: false,
        message: "Parent, learner and relationship are required"
      });
    }

    const parent = await prisma.parent.findUnique({
      where: { id: parentId }
    });

    const learner = await prisma.learner.findUnique({
      where: { id: learnerId }
    });

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found"
      });
    }

    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner not found"
      });
    }

    const existingLink = await prisma.learnerParent.findUnique({
      where: {
        learnerId_parentId: {
          learnerId,
          parentId
        }
      }
    });

    if (existingLink) {
      return res.status(409).json({
        success: false,
        message: "Parent is already linked to this learner"
      });
    }

    const link = await prisma.learnerParent.create({
      data: {
        learnerId,
        parentId,
        relationship,
        isPrimary
      }
    });

    res.status(201).json({
      success: true,
      message: "Parent linked to learner successfully",
      link
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to link parent to learner"
    });
  }
};

module.exports = {
  createParent,
  getParents,
  getParent,
  linkParentToLearner
};