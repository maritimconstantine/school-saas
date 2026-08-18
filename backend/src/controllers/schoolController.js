const prisma = require("../config/db");

const registerSchool = async (req, res) => {
  try {
    const {
      name,
      code,
      address,
      phone,
      email,
      county
    } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "School name and code are required"
      });
    }

    const existingSchool = await prisma.school.findUnique({
      where: {
        code
      }
    });

    if (existingSchool) {
      return res.status(409).json({
        success: false,
        message: "School code already exists"
      });
    }

    const school = await prisma.school.create({
      data: {
        name,
        code,
        address,
        phone,
        email,
        county
      }
    });

    res.status(201).json({
      success: true,
      message: "School registered successfully",
      school
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to register school"
    });
  }
};

const getSchools = async (req, res) => {
  try {
    const schools = await prisma.school.findMany({
      orderBy: {
        name: "asc"
      }
    });

    res.json({
      success: true,
      schools
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch schools"
    });
  }
};

module.exports = {
  registerSchool,
  getSchools
};