const { prisma } = require("../../../config/prisma");

const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        return res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const getProductById = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await prisma.product.findUnique({
            where: { id:id },
        });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price
            }
        });
        return res.status(201).json({ success: true, data: product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price
            }
        });
        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({
            where: { id }
        });
        return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };