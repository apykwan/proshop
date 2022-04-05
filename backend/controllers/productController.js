import fs from 'fs';
import path from 'path';
import asyncHandler from 'express-async-handler';

import Product from '../models/productModel.js'

// @desc        Fetch all products
// @route       GET /api/products
// @access      Public
export const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});

    res.json(products);
});

// @desc        Fetch single product
// @route       GET /api/products/:id
// @access      Public
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found!');
    }

    res.json(product);
});

// @desc        Delete a product
// @route       DELETE /api/products/:id
// @access      Private / Admin
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found!');
    }

    fs.unlink(path.join(path.resolve(), product.image), err => {
        console.log(err);
    });

    await product.remove()
    res.json({
        message: `${product.name} has been removed!`
    });
});


// @desc        Create a product
// @route       POST /api/products
// @access      Private / Admin
export const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: "Sample Name",
        price: 10,
        user: req.user._id,
        image: "/images/sample.jpg",
        brand: "Sample Brand",
        category: "Sample Category",
        countInStock: 2,
        numReviews: 9,
        description: "Sample Description"
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc        Update a product
// @route       PUT /api/products
// @access      Private / Admin
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product Not Found');
    }

    const { 
        name = product.name, 
        price = product.price, 
        description = product.description, 
        brand = product.brand, 
        category = product.category, 
        countInStock = product.countInStock
    } = req.body;

    if (req.file) {
        fs.unlink(path.join(path.resolve(), product.image), err => {
            console.log(err);
        });
        product.image = `/${req.file.path}`;
    }
    
    product.name = name;
    product.price = price;
    product.description = description;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
});

// @desc        Create new review
// @route       POST /api/products/:id/review
// @access      Private / Admin
export const createProductReview = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product Not Found');
    }

    const { rating, comment } = req.body;

    const alreadyReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString());
    if (alreadyReviewed) throw new Error('You already reviewed the product!');

    const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({ message: 'Review added '});
});