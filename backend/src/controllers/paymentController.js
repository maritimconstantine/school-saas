const prisma = require("../config/db");

// Generate receipt number
const generateReceiptNumber = async () => {
  const count = await prisma.payment.count();

  const number = count + 1;

  return `RCT-${new Date().getFullYear()}-${String(number).padStart(6, "0")}`;
};

// ==========================================
// RECORD PAYMENT
// ==========================================

const createPayment = async (req, res) => {
  try {
    const {
      learnerId,
      amount,
      paymentMethod,
      transactionReference,
      paymentDate,
      remarks
    } = req.body;

    if (
      !learnerId ||
      amount === undefined ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Learner, amount and payment method are required"
      });
    }

    const paymentAmount = Number(amount);

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment amount must be greater than zero"
      });
    }

    // Find learner
    const learner = await prisma.learner.findUnique({
      where: {
        id: learnerId
      },

      include: {
        grade: true,
        schoolClass: true,
        academicYear: true
      }
    });

    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner not found"
      });
    }

    // Check duplicate transaction reference
    if (transactionReference) {
      const existing =
        await prisma.payment.findUnique({
          where: {
            transactionReference
          }
        });

      if (existing) {
        return res.status(409).json({
          success: false,
          message:
            "This transaction reference already exists"
        });
      }
    }

    const receiptNumber =
      await generateReceiptNumber();

    const payment =
      await prisma.payment.create({
        data: {
          learnerId,
          amount: paymentAmount,
          paymentMethod,
          transactionReference:
            transactionReference || null,

          paymentDate: paymentDate
            ? new Date(paymentDate)
            : new Date(),

          remarks: remarks || null,

          receiptNumber,

          recordedById: req.user.id
        },

        include: {
          learner: {
            include: {
              grade: true,
              schoolClass: true
            }
          },

          recordedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      payment
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to record payment"
    });
  }
};

// ==========================================
// PAYMENT HISTORY FOR LEARNER
// ==========================================

const getLearnerPayments = async (req, res) => {
  try {
    const { learnerId } = req.params;

    const learner =
      await prisma.learner.findUnique({
        where: {
          id: learnerId
        },

        include: {
          grade: true,
          schoolClass: true,
          academicYear: true
        }
      });

    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner not found"
      });
    }

    const payments =
      await prisma.payment.findMany({
        where: {
          learnerId
        },

        include: {
          recordedBy: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },

        orderBy: {
          paymentDate: "desc"
        }
      });

    const totalPaid = payments.reduce(
      (sum, payment) =>
        sum + Number(payment.amount),
      0
    );

    res.json({
      success: true,

      learner: {
        id: learner.id,
        admissionNumber:
          learner.admissionNumber,
        name:
          `${learner.firstName} ${learner.lastName}`,
        grade: learner.grade,
        class: learner.schoolClass
      },

      totalPaid,

      payments
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to retrieve payment history"
    });
  }
};

// ==========================================
// ALL PAYMENTS
// ==========================================

const getPayments = async (req, res) => {
  try {
    const {
      search,
      paymentMethod,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    const pageNumber =
      Math.max(Number(page), 1);

    const pageSize =
      Math.min(
        Math.max(Number(limit), 1),
        100
      );

    const where = {};

    if (paymentMethod) {
      where.paymentMethod =
        paymentMethod;
    }

    if (startDate || endDate) {
      where.paymentDate = {};

      if (startDate) {
        where.paymentDate.gte =
          new Date(startDate);
      }

      if (endDate) {
        const end =
          new Date(endDate);

        end.setHours(
          23,
          59,
          59,
          999
        );

        where.paymentDate.lte = end;
      }
    }

    if (search) {
      where.learner = {
        OR: [
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
        ]
      };
    }

    const [payments, total] =
      await prisma.$transaction([
        prisma.payment.findMany({
          where,

          include: {
            learner: {
              select: {
                id: true,
                admissionNumber: true,
                firstName: true,
                lastName: true
              }
            },

            recordedBy: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          },

          orderBy: {
            paymentDate: "desc"
          },

          skip:
            (pageNumber - 1) *
            pageSize,

          take: pageSize
        }),

        prisma.payment.count({
          where
        })
      ]);

    res.json({
      success: true,
      payments,

      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages:
          Math.ceil(
            total / pageSize
          )
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to retrieve payments"
    });
  }
};

module.exports = {
  createPayment,
  getLearnerPayments,
  getPayments
};