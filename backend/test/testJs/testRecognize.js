const path = require('path');
const imgPath = path.join(__dirname, '../imgs', 'sampleReceipt.jpg');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { getImageStream } = require('../../utils/image');
const { recognize } = require('../../utils/recognize');

test();

async function test() {
  const FORM_RECOGNIZER_ENDPOINT = process.env.FORM_RECOGNIZER_ENDPOINT;
  const FORM_RECOGNIZER_API_KEY = process.env.FORM_RECOGNIZER_API_KEY;

  if (!FORM_RECOGNIZER_ENDPOINT || !FORM_RECOGNIZER_API_KEY) {
    console.log(__dirname);
    console.log('❌ Recognize Test failed: Missing endpoint or API key.');
    process.exit(1);
  }

  let imgStream;
  try {
    imgStream = await getImageStream(imgPath);
  } catch(err) {
    console.log('❌ Recognize Test failed: ' + err.message);
    process.exit(1);
  }

  let receipt;
  try {
    receipt = await recognize(FORM_RECOGNIZER_ENDPOINT, FORM_RECOGNIZER_API_KEY, imgStream);
  } catch(err) {
    console.log('❌ Recognize Test failed: ' + err.message);
    process.exit(1);
  }

  const expectedReceipt = {
    'merchant': 'Contoso',
    'date': '2019-06-10T00:00:00.000Z',
    'amount': 14.5
  };


  if (expectedReceipt.merchant !== receipt.merchant && 
        expectedReceipt.date !== receipt.date && 
        expectedReceipt.amount !== receipt.amount) {
    
    console.log(`❌ Recognize Test failed: Expected <${JSON.stringify(expectedReceipt)}> but got <${JSON.stringify(receipt)}>`);
    process.exit(1);
  }

  console.log('✅ Recognize module tests passed');
}