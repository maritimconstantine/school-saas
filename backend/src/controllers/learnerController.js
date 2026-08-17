const prisma = require("../config/db");

// ==========================================
// CREATE LEARNER
// ==========================================

const createLearner = async (req, res) => {
  try {
    const {
      admissionNumber,
      firstName,
      middleName,
      lastName,
      gender,
      dateOfBirth,
      admissionDate,
      gradeId,
      classId,
      academicYearId,
      address,
      phone,
      profilePhoto,
      notes
    } = req.body;

    if (
      !admissionNumber ||
      !firstName ||
      !lastName ||
      !gradeId ||
      !academicYearId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Admission number, first name, last name, grade and academic year are required"
      });
    }

    // Check admission number
    const existingLearner =
      await prisma.learner.findUnique({
        where: {
          admissionNumber
        }
      });

    if (existingLearner) {
      return res.status(409).json({
        success: false,
        message: "Admission number already exists"
      });
    }

    // Check grade
    const grade = await prisma.grade.findUnique({
      where: {
        id: gradeId
      }
    });

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: "Grade not found"
      });
    }

    // Check academic year
    const academicYear =
      await prisma.academicYear.findUnique({
        where: {
          id: academicYearId
        }
      });

    if (!academicYear) {
      return res.status(404).json({
        success: false,
        message: "Academic year not found"
      });
    }

    // If class is supplied, verify it belongs to the grade
    if (classId) {
      const schoolClass =
        await prisma.schoolClass.findUnique({
          where: {
            id: classId
          }
        });

      if (!schoolClass) {
        return res.status(404).json({
          success: false,
          message: "Class not found"
        });
      }

      if (schoolClass.gradeId !== gradeId) {
        return res.status(400).json({
          success: false,
          message: "Selected class does not belong to the selected grade"
        });
      }
    }

    const learner = await prisma.learner.create({
      data: {
        admissionNumber,
        firstName,
        middleName,
        lastName,
        gender: gender || null,
        dateOfBirth: dateOfBirth
          ? new Date(dateOfBirth)
          : null,
        admissionDate: admissionDate
          ? new Date(admissionDate)
          : new Date(),

        gradeId,
        classId: classId || null,
        academicYearId,

        address,
        phone,
        profilePhoto,
        notes
      },

      include: {
        grade: true,
        schoolClass: true,
        academicYear: true
      }
    });

    res.status(201).json({
      success: true,
      message: "Learner registered successfully",
      learner
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to register learner"
    });
  }
};

// ==========================================
// GET LEARNERS
// ==========================================

const getLearners = async (req, res) => {
  try {
    const {
      search,
      gradeId,
      classId,
      academicYearId,
      status,
      page = 1,
      limit = 20,
      sortBy = "lastName",
      order = "asc"
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.min(
      Math.max(Number(limit), 1),
      100
    );

    const where = {};

    // Search
    if (search) {
      where.OR = [
        {
          firstName: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          middleName: {
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
          admissionNumber: {
            contains: search,
            mode: "insensitive"
          }
        }
      ];
    }

    if (gradeId) {
      where.gradeId = gradeId;
    }

    if (classId) {
      where.classId = classId;
    }

    if (academicYearId) {
      where.academicYearId = academicYearId;
    }

    if (status) {
      where.status = status;
    }

    const allowedSortFields = [
      "firstName",
      "lastName",
      "admissionNumber",
      "createdAt"
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "lastName";

    const safeOrder = order === "desc" ? "desc" : "asc";

    const [learners, total] =
      await prisma.$transaction([
        prisma.learner.findMany({
          where,

          include: {
            grade: true,
            schoolClass: true,
            academicYear: true,

            parents: {
              include: {
                parent: true
              }
            }
          },

          orderBy: {
            [safeSortBy]: safeOrder
          },

          skip: (pageNumber - 1) * pageSize,
          take: pageSize
        }),

        prisma.learner.count({
          where
        })
      ]);

    res.json({
      success: true,
      learners,

      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(
          total / pageSize
        )
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve learners"
    });
  }
};

// ==========================================
// GET SINGLE LEARNER
// ==========================================

const getLearner = async (req, res) => {
  try {
    const { id } = req.params;

    const learner = await prisma.learner.findUnique({
      where: {
        id
      },

      include: {
        grade: true,
        schoolClass: true,
        academicYear: true,

        parents: {
          include: {
            parent: true
          }
        },

        payments: {
          orderBy: {
            paymentDate: "desc"
          },

          take: 20
        }
      }
    });

    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner not found"
      });
    }

    res.json({
      success: true,
      learner
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve learner"
    });
  }
};

// ==========================================
// UPDATE LEARNER
// ==========================================

const updateLearner = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      firstName,
      middleName,
      lastName,
      gender,
      dateOfBirth,
      gradeId,
      classId,
      academicYearId,
      address,
      phone,
      profilePhoto,
      notes,
      status
    } = req.body;

    const existingLearner =
      await prisma.learner.findUnique({
        where: { id }
      });

    if (!existingLearner) {
      return res.status(404).json({
        success: false,
        message: "Learner not found"
      });
    }

    if (gradeId) {
      const grade = await prisma.grade.findUnique({
        where: { id: gradeId }
      });

      if (!grade) {
        return res.status(404).json({
          success: false,
          message: "Grade not found"
        });
      }
    }

    if (classId) {
      const schoolClass =
        await prisma.schoolClass.findUnique({
          where: {
            id: classId
          }
        });

      if (!schoolClass) {
        return res.status(404).json({
          success: false,
          message: "Class not found"
        });
      }

      const selectedGrade =
        gradeId || existingLearner.gradeId;

      if (
        schoolClass.gradeId !== selectedGrade
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Selected class does not belong to selected grade"
        });
      }
    }

    const learner =
      await prisma.learner.update({
        where: {
          id
        },

        data: {
          firstName,
          middleName,
          lastName,
          gender: gender || undefined,

          dateOfBirth: dateOfBirth
            ? new Date(dateOfBirth)
            : undefined,

          gradeId,
          classId,
          academicYearId,

          address,
          phone,
          profilePhoto,
          notes,
          status
        },

        include: {
          grade: true,
          schoolClass: true,
          academicYear: true
        }
      });

    res.json({
      success: true,
      message: "Learner updated successfully",
      learner
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update learner"
    });
  }
};

module.exports = {
  createLearner,
  getLearners,
  getLearner,
  updateLearner
};