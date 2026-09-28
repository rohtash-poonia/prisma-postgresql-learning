const { prisma } = require("../../../config/prisma");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await prisma.$transaction(async (transaction) => {
      const cartItems = await transaction.cart.findMany({
        where: { userId },
        include: { product: true },
      });

      if (cartItems.length === 0) {
        return { empty: true };
      }

      const categorizedItems = [];
      for (const item of cartItems) {
        const category = await transaction.category.findFirst({
          where: {
            OR: [
              { id: item.product.category },
              { name: item.product.category },
            ],
          },
        });

        if (!category) {
          return { missingCategory: item.product.category };
        }

        categorizedItems.push({ item, category });
      }

      const orders = [];
      for (const { item, category } of categorizedItems) {
        const order = await transaction.order.create({
          data: {
            userId,
            productId: item.productId,
            categoryId: category.id,
            quantity: item.quantity,
            total: item.product.price * item.quantity,
          },
          include: {
            product: true,
            category: true,
            user: {
              select: {
                id: true,
                username: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        });
        orders.push(order);
      }

      await transaction.cart.deleteMany({ where: { userId } });
      return { orders };
    });

    if (result.empty) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    if (result.missingCategory) {
      return res.status(400).json({
        success: false,
        message: `No category found for product category: ${result.missingCategory}`,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: result.orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        product: true,
        category: true,
        user: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });
    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};

module.exports = { createOrder, getOrders };
