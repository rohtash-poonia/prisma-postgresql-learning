require("dotenv").config();
const express = require("express");
const { prisma } = require("./src/config/prisma.js");
const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const seedData = async () => {
  await prisma.user.create({
    data: {
      firstname: "rohtash",
      username: "rohtash_poonia_",
      lastname: "poonia",
      email: "rohtashpoonia2274@gmail.com",
      password: "poonia2274",
    },
  });
};

seedData()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exitCode = 1;
  });
