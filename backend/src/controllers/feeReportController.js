const prisma = require("../config/db");

// ==========================================
// GET LEARNER FEE SUMMARY
// ==========================================

const getLearnerFeeSummary = async (req, res) => {
  try {
    const { learnerId } = req.params;

    const learner = await prisma.learner.findUnique({
      where: {
        id: learnerId
      },

      include: {
        academicYear: true,
        grade: true,
        schoolClass: true,

        payments: {
          orderBy: {
            paymentDate: "desc"
          }
        }
      }
    });

    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner not found"
      });
    }

    // Get fee structure for learner's grade
    const feeStructures = await prisma.feeStructure.findMany({
      where: {
        academicYearId: learner.academicYearId,
        gradeId: learner.gradeId
      },

      include: {
        feeCategory: true
      }
    });

    const totalFees = feeStructures.reduce(
      (total, fee) => total + Number(fee.amount),
      0
    );

    const totalPaid = learner.payments.reduce(
      (total, payment) => total + Number(payment.amount),
      0
    );

    const balance = totalFees - totalPaid;

    res.json({
      success: true,

      learner: {
        id: learner.id,
        admissionNumber: learner.admissionNumber,
        firstName: learner.firstName,
        middleName: learner.middleName,
        lastName: learner.lastName,
        grade: learner.grade,
        class: learner.schoolClass,
        academicYear: learner.academicYear
      },

      fees: {
        totalFees,
        totalPaid,
        balance
      },

      feeBreakdown: feeStructures,

      payments: learner.payments
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate learner fee summary"
    });
  }
};


// ==========================================
// SEARCH AND SORT LEARNERS BY FEES
// ==========================================

const getLearnerFeeReports = async (req, res) => {
  try {
    const {
      search,
      gradeId,
      classId,
      sortBy = "name",
      order = "asc"
    } = req.query;

    const where = {};

    // Grade filter
    if (gradeId) {
      where.gradeId = gradeId;
    }

    // Class filter
    if (classId) {
      where.classId = classId;
    }

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

    const learners = await prisma.learner.findMany({
      where,

      include: {
        grade: true,
        schoolClass: true,
        academicYear: true,

        payments: true
      }
    });

    const reports = await Promise.all(
      learners.map(async (learner) => {

        const feeStructures =
          await prisma.feeStructure.findMany({
            where: {
              academicYearId: learner.academicYearId,
              gradeId: learner.gradeId
            }
          });

        const totalFees = feeStructures.reduce(
          (sum, fee) => sum + Number(fee.amount),
          0
        );

        const totalPaid = learner.payments.reduce(
          (sum, payment) => sum + Number(payment.amount),
          0
        );

        const balance = totalFees - totalPaid;

        return {
          id: learner.id,

          admissionNumber:
            learner.admissionNumber,

          name:
            `${learner.firstName} ${learner.lastName}`,

          grade: learner.grade?.name || null,

          class:
            learner.schoolClass?.name || null,

          totalFees,

          totalPaid,

          balance
        };
      })
    );

    // Sorting
    reports.sort((a, b) => {

      let valueA;
      let valueB;

      switch (sortBy) {

        case "paid":
          valueA = a.totalPaid;
          valueB = b.totalPaid;
          break;

        case "balance":
          valueA = a.balance;
          valueB = b.balance;
          break;

        case "fees":
          valueA = a.totalFees;
          valueB = b.totalFees;
          break;

        case "name":
        default:
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
      }

      if (valueA < valueB) {
        return order === "asc" ? -1 : 1;
      }

      if (valueA > valueB) {
        return order === "asc" ? 1 : -1;
      }

      return 0;
    });

    res.json({
      success: true,

      count: reports.length,

      learners: reports
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate fee reports"
    });
  }
};


// ==========================================
// SCHOOL FEE SUMMARY
// ==========================================

const getSchoolFeeSummary = async (req, res) => {
  try {

    const learners = await prisma.learner.findMany({
      include: {
        payments: true
      }
    });

    let totalFees = 0;
    let totalPaid = 0;

    for (const learner of learners) {

      const feeStructures =
        await prisma.feeStructure.findMany({
          where: {
            academicYearId: learner.academicYearId,
            gradeId: learner.gradeId
          }
        });

      totalFees += feeStructures.reduce(
        (sum, fee) => sum + Number(fee.amount),
        0
      );

      totalPaid += learner.payments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0
      );
    }

    const totalBalance =
      totalFees - totalPaid;

    res.json({
      success: true,

      summary: {
        totalLearners: learners.length,
        totalFees,
        totalPaid,
        totalBalance
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate school fee summary"
    });
  }
};


module.exports = {
  getLearnerFeeSummary,
  getLearnerFeeReports,
  getSchoolFeeSummary
};