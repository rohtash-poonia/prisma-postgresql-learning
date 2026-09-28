const { prisma } = require("../../../config/prisma");

const getCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: true }
    });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await prisma.cart.upsert({
      where: { userId: req.user.id },
      update: {},
      create: { userId: req.user.id }
    });
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity
      }
    });
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const cartItem = await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: req.user.id,
          productId
        }
      }
    });
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 
const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cartItem = await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: req.user.id,
          productId
        }
      },
      data: {
        quantity
      }
    });
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem
};