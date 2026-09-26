require("dotenv").config();
const express = require("express");
const { prisma } = require("./src/config/prisma.js");
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api", require("./src/modules/auth/routes/auth.route.js"));
app.use("/api", require("./src/modules/users/routes/user.routes.js"));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// const seedData = async () => {
//   await prisma.user.create({
//     data: {
//       firstname: "rohtash",
//       username: "rohtash_poonia_",
//       lastname: "poonia",
//       email: "rohtashpoonia2274@gmail.com",
//       password: "poonia2274",
//     },
//   });
// };

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
