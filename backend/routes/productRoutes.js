import express from 'express';

import { protect, admin } from '../middleware/authMiddleware.js';
import { 
    getProducts, 
    getProductById, 
    deleteProduct, 
    createProduct,
    updateProduct,
    createProductReview
} from '../controllers/productController.js';
import upload from '../middleware/uploadImage.js';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct);

router.route('/:id/reviews')
    .post(protect, createProductReview);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin,upload.single('image'), updateProduct)
    .delete(protect, admin, deleteProduct);

export default router;