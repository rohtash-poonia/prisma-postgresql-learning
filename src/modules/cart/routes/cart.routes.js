const express = require("express");
const router = express.Router();

router.post(
  "/addtocart",
  // require("../../middleware/auth"),
  require("../controller/cart.controller").addToCart
)
router.get(
  "/getcart",
  // require("../../middleware/auth"),    
  require("../controller/cart.controller").getCart
);
router.delete(
  "/removefromcart",
  // require("../../middleware/auth"),
  require("../controller/cart.controller").removeFromCart
);
router.put(
  "/updatecartitem",
  // require("../../middleware/auth"),
  require("../controller/cart.controller").updateCartItem
);

module.exports = router;
