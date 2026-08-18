const prisma = require("../config/db");
const PDFDocument = require("pdfkit");

const generateReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    const payment =
      await prisma.payment.findUnique({
        where: {
          id
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
              firstName: true,
              lastName: true
            }
          }
        }
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    const doc = new PDFDocument({
      margin: 50
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `inline; filename="receipt-${payment.receiptNumber}.pdf"`
    );

    doc.pipe(res);

    // School heading
    doc
      .fontSize(20)
      .text(
        "SCHOOL FEE PAYMENT RECEIPT",
        {
          align: "center"
        }
      );

    doc.moveDown();

    doc
      .fontSize(12)
      .text(
        `Receipt No: ${payment.receiptNumber}`
      );

    doc.text(
      `Date: ${new Date(
        payment.paymentDate
      ).toLocaleDateString()}`
    );

    doc.moveDown();

    doc.text(
      `Admission No: ${payment.learner.admissionNumber}`
    );

    doc.text(
      `Learner: ${payment.learner.firstName} ${payment.learner.lastName}`
    );

    doc.text(
      `Grade: ${payment.learner.grade?.name || "-"}`
    );

    doc.text(
      `Class: ${payment.learner.schoolClass?.name || "-"}`
    );

    doc.moveDown();

    doc
      .fontSize(14)
      .text(
        `Amount Paid: KES ${Number(
          payment.amount
        ).toLocaleString()}`,
        {
          bold: true
        }
      );

    doc.moveDown();

    doc
      .fontSize(12)
      .text(
        `Payment Method: ${payment.paymentMethod}`
      );

    doc.text(
      `Transaction Reference: ${
        payment.transactionReference || "-"
      }`
    );

    doc.text(
      `Recorded By: ${payment.recordedBy.firstName} ${payment.recordedBy.lastName}`
    );

    if (payment.remarks) {
      doc.moveDown();

      doc.text(
        `Remarks: ${payment.remarks}`
      );
    }

    doc.moveDown(2);

    doc.text(
      "Thank you for your payment.",
      {
        align: "center"
      }
    );

    doc.end();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to generate receipt"
    });
  }
};

module.exports = {
  generateReceipt
};