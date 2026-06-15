const checkoutService = require('../services/checkoutService');

function checkout(req, res) {
  try {
    const result = checkoutService.checkout(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

module.exports = {
  checkout,
};
