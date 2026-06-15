const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const router = express.Router();
const swaggerDocument = YAML.load(
  path.join(__dirname, '../../swagger.yaml')
);

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
