const express = require("express");
const router = express.Router();

router.post(
  "/categories",
  // require("../../middleware/auth"),
  // require("../../middleware/role"),
  require("../controller/category.controller")
    .createCategory,
);
router.get(
  "/categories",
  require("../controller/category.controller")
    .getAllCategories,
);
router.get(
  "/categories/:id",
  require("../controller/category.controller")
    .getCategoryById,
);
router.put(
  "/categories/:id",
  // require("../../middleware/auth"),
  // require("../../middleware/role"),
  require("../controller/category.controller")
    .updateCategory,
);
router.delete(
  "/categories/:id",
  // require("../../middleware/auth"),
  // require("../../middleware/role"),
  require("../controller/category.controller")
    .deleteCategory,
);

module.exports = router;
