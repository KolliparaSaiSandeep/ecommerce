import productModel from '../models/productModel.js';
import fs from 'fs';
import slugify from 'slugify';
import categoryModel from '../models/categoryModel.js';
import orderModel from '../models/orderModel.js';
import braintree from 'braintree';

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_Merchant_ID,
  publicKey: process.env.BRAINTREE_Public_Key,
  privateKey: process.env.BRAINTREE_Private_Key,
});

export const createProductController = async (req, res) => {
  console.log('I AM HERE,,,,,,');
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ error: 'Name is Required' });
      case !description:
        return res.status(500).send({ error: 'Description is Required' });
      case !price:
        return res.status(500).send({ error: 'Price is Required' });
      case !category:
        return res.status(500).send({ error: 'Category is Required' });
      case !quantity:
        return res.status(500).send({ error: 'Quantity is Required' });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: 'photo is Required and should be less then 1mb' });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: 'Product Created Successfully',
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error in creating product',
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate('category')
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: 'AllProducts',
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in getting products',
      error: error.message,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const products = await productModel
      .findOne({ slug: req.params.slug })
      .select('-photo')
      .populate('category');
    res.status(200).send({
      success: true,
      message: 'Single Product Fetched',
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in getting products',
      error: error.message,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select('photo');
    if (product.photo.data) {
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error while getting photo',
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select('-photo');
    res.status(200).send({
      success: true,
      message: 'Product Deleted Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error while deleting products',
      error: error.message,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: 'Name is Required' });
      case !description:
        return res.status(500).send({ error: 'Description is Required' });
      case !price:
        return res.status(500).send({ error: 'Price is Required' });
      case !category:
        return res.status(500).send({ error: 'Category is Required' });
      case !quantity:
        return res.status(500).send({ error: 'Quantity is Required' });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: 'photo is Required and should be less then 1mb' });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: 'Product Updated Successfully',
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error in Update product',
    });
  }
};

export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: 'Error WHile Filtering Products',
      error,
    });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    console.log(keyword);
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
      })
      .select('-photo');
    return res.status(200).send({ results });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: 'Error in search product API', error });
  }
};

export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select('-photo')
      .limit(3)
      .populate('category');
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: 'error while getting related product',
      error,
    });
  }
};

export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate('category');
    console.log(category);
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: 'Error While Getting products',
    });
  }
};

export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) return res.status(500).send(err);
      // Send client token to the request issuer.
      res.send(response);
    });
  } catch (e) {
    console.log('ERROR IN GENERATING BRAINTREE TOKEN', e);
    res.status(500).send(e);
  }
};

export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    console.log(total);
    console.log(req.user._id);
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(401).json({ message: 'Braintree Payment Failed' });
        }
      }
    );
  } catch (e) {
    console.log('Error in Braintree Payment Controller', e);
    res.status(500).send(e);
  }
};
