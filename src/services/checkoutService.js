const productModel = require('../models/productModel');

const VALID_PAYMENT_METHODS = ['cash', 'credit_card'];
const CASH_DISCOUNT_RATE = 0.1;

function checkout({ productIds, paymentMethod }) {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    const error = new Error('productIds must be a non-empty array');
    error.statusCode = 400;
    throw error;
  }

  if (!paymentMethod) {
    const error = new Error('paymentMethod is required');
    error.statusCode = 400;
    throw error;
  }

  if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    const error = new Error('Payment method must be cash or credit_card');
    error.statusCode = 400;
    throw error;
  }

  const products = productModel.findByIds(productIds);

  if (products.length !== productIds.length) {
    const error = new Error('One or more products were not found');
    error.statusCode = 404;
    throw error;
  }

  const subtotal = products.reduce((sum, product) => sum + product.price, 0);
  const discount =
    paymentMethod === 'cash' ? roundCurrency(subtotal * CASH_DISCOUNT_RATE) : 0;
  const total = roundCurrency(subtotal - discount);

  return {
    items: products,
    paymentMethod,
    subtotal: roundCurrency(subtotal),
    discount,
    total,
  };
}

function roundCurrency(amount) {
  return Math.round(amount * 100) / 100;
}

module.exports = {
  checkout,
};
