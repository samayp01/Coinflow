/**
 * Image utility functions
 */

const fs = require('fs');

async function getImageStream(imgFile) {
  if (!imgFile || !fs.existsSync(imgFile)) {
    throw new Error('Invalid image file');
  }

  const imgStream = fs.createReadStream(imgFile);
  return imgStream;
}

async function deleteImage(imgFile) {
  if (imgFile && fs.existsSync(imgFile)) {
    fs.unlink(imgFile, (err) => {
      if (err) console.error('Error deleting file:', err)
    });
  }
}

module.exports = {
  getImageStream,
  deleteImage
};