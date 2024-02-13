import express from 'express';
import {
  loginController,
  registerController,
} from '../controllers/authController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/authMiddleware.js';
import {
  testController,
  updateProfileController,
} from '../controllers/authController.js';
import {
  forgotpasswordcontroller,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  allusersController,
} from '../controllers/authController.js';
const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/forgot-password', forgotpasswordcontroller);
router.post('/test', requireSignIn, isAdmin, testController);
router.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.put('/profile', requireSignIn, updateProfileController);

router.get('/orders', requireSignIn, getOrdersController);

router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);

router.put(
  '/order-status/:orderId',
  requireSignIn,
  isAdmin,
  orderStatusController
);

router.get('/allusers', requireSignIn, isAdmin, allusersController);

export default router;
