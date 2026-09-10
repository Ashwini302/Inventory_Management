import mongoose from 'mongoose';
import Product from '../models/Product.js';

/**
 * Validate input fields helper
 */
const validateProductInput = (data) => {
  const errors = [];
  const { name, category, price, quantity, minStock } = data;

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Product name is required');
  }

  if (!category || typeof category !== 'string' || !category.trim()) {
    errors.push('Category is required');
  }

  if (price === undefined || price === null || isNaN(Number(price))) {
    errors.push('Price is required and must be a valid number');
  } else if (Number(price) <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (quantity === undefined || quantity === null || isNaN(Number(quantity))) {
    errors.push('Quantity is required and must be a valid number');
  } else if (Number(quantity) < 0) {
    errors.push('Quantity cannot be negative');
  } else if (!Number.isInteger(Number(quantity))) {
    errors.push('Quantity must be an integer');
  }

  if (minStock === undefined || minStock === null || isNaN(Number(minStock))) {
    errors.push('Minimum stock is required and must be a valid number');
  } else if (Number(minStock) < 0) {
    errors.push('Minimum stock cannot be negative');
  } else if (!Number.isInteger(Number(minStock))) {
    errors.push('Minimum stock must be an integer');
  }

  return errors;
};

/**
 * @desc    Create a new product
 * @route   POST /products
 */
export const createProduct = async (req, res, next) => {
  try {
    const validationErrors = validateProductInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors[0],
        errors: validationErrors,
      });
    }

    const { name, category, price, quantity, minStock } = req.body;

    const product = new Product({
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      quantity: Number(quantity),
      minStock: Number(minStock),
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all products (with optional search and category filters)
 * @route   GET /products
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    if (category && category.trim() && category.trim() !== 'All Categories') {
      filter.category = { $regex: `^${category.trim()}$`, $options: 'i' };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get low stock products (quantity <= minStock)
 * @route   GET /products/low-stock
 */
export const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$quantity', '$minStock'] },
    }).sort({ quantity: 1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a product by ID
 * @route   PUT /products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    const validationErrors = validateProductInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors[0],
        errors: validationErrors,
      });
    }

    const { name, category, price, quantity, minStock } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        category: category.trim(),
        price: Number(price),
        quantity: Number(quantity),
        minStock: Number(minStock),
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product by ID
 * @route   DELETE /products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: { id: deletedProduct.id },
    });
  } catch (error) {
    next(error);
  }
};
