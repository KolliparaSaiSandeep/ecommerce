import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import formidable from 'express-formidable';
import {
  createProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productFiltersController,
  searchProductController,
  relatedProductController,
  productCategoryController,
  braintreeTokenController,
  braintreePaymentController,
} from '../controllers/productController.js';

const router = express.Router();

router.post(
  '/create-product',
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

router.get('/get-product', getProductController);
router.get('/get-product/:slug', getSingleProductController);
router.get('/product-photo/:pid', productPhotoController);
router.delete('/product', deleteProductController);
router.post(
  '/update-product/:pid',
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

router.post('/product-filters', productFiltersController);

router.get('/search/:keyword', searchProductController);

router.get('/related-product/:pid/:cid', relatedProductController);

router.get('/product-category/:slug', productCategoryController);

router.get('/braintree/token', braintreeTokenController);

router.post('/braintree/payment', requireSignIn, braintreePaymentController);

export default router;
