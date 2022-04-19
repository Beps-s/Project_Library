const express = require('express');
// get using express router
const router = express.Router();
// define book controller and export it for this file
const loansController = require('../controllers/loans');

// use controller functions according to the route
router.get('/', loansController.getAllLoans);

// export book router for using in default application file
module.exports = router;