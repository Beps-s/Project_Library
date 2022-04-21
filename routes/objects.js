const express = require('express');
// get using express router
const router = express.Router();
// define book controller and export it for this file
const objectsController = require('../controllers/objects');

// use controller functions according to the route
router.get('/', objectsController.getAllObjects);
router.post('/borrow', objectsController.loanBook);

// export book router for using in default application file
module.exports = router;