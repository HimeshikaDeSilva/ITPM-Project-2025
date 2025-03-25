const express = require('express');
const multer = require('multer');
const { scanFood } = require('../controller/foodscan.controller');


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/scan-food', upload.single('image'), scanFood);

module.exports = router;
