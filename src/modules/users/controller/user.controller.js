const bcrypt = require("bcrypt");
const { prisma } = require("../../../config/prisma");

const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    if (!firstname || !lastname || !username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await (await prisma).user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // yaha dalna hai collected data database me
    const user = (await prisma).user.create({
      data: { firstname, lastname, username, email, password: hashedPassword },
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("registerUser error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { registerUser };
