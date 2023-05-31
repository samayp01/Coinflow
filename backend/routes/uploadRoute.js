const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { getImageStream, deleteImage } = require('../utils/image');
const { recognize } = require('../utils/recognize');
const authorize = require('./middleware/authorize');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const imgDir = path.join(__dirname, '../static', 'uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imgDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

let upload = multer({ storage: storage });

router.post('/recognize', authorize, upload.single('receipt-pic'), async (req, res) => {
  if (!req.file || !req.file.filename) {
    return res.status(400).send('Missing receipt image');
  }

  const imgPath = `${imgDir}/${req.file.filename}`;
  const FORM_RECOGNIZER_ENDPOINT = process.env.FORM_RECOGNIZER_ENDPOINT;
  const FORM_RECOGNIZER_API_KEY = process.env.FORM_RECOGNIZER_API_KEY;

  if (!FORM_RECOGNIZER_ENDPOINT || !FORM_RECOGNIZER_API_KEY) {
    deleteImage(imgPath);
    return res.status(401).send('Missing form recognizer endpoint or API key.');
  }

  let imgStream;
  try {
    imgStream = await getImageStream(imgPath);
  } catch(err) {
    deleteImage(imgPath);
    return res.status(400).send('Failed to read image. ' + err.message);
  }

  let receipt;
  try {
    receipt = await recognize(FORM_RECOGNIZER_ENDPOINT, FORM_RECOGNIZER_API_KEY, imgStream);
  } catch(err) {
    deleteImage(imgPath);
    return res.status(400).send(err.message);
  }

  deleteImage(imgPath);

  res.status(200).send({
    merchant: receipt.merchant,
    date: receipt.date,
    amount: receipt.amount
  });
});

module.exports = router;