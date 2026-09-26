const bcrypt = require("bcrypt");
const { prisma } = require("../../../config/prisma");
const jwt = require("jsonwebtoken")

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
const loginUser = async (req,res) =>{
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }
      // Find user in PostgreSQL
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
      // Compare entered password with hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
         console.error(error);

         return res.status(500).json({
           message: "Internal server error",
         });
    }
}
module.exports = { registerUser, loginUser };
