/**
 * Receipt recognition module
 */

const { DocumentAnalysisClient, AzureKeyCredential } = require('@azure/ai-form-recognizer');

async function recognize(FORM_RECOGNIZER_ENDPOINT, FORM_RECOGNIZER_API_KEY, imgStream) {
  const client = new DocumentAnalysisClient(FORM_RECOGNIZER_ENDPOINT, new AzureKeyCredential(FORM_RECOGNIZER_API_KEY));
  const poller = await client.beginAnalyzeDocument('prebuilt-receipt', imgStream, {
    contentType: 'image/jpeg'
  });

  const { documents: [receipt] } = await poller.pollUntilDone();
  if (receipt === undefined) {
    throw new Error('Failed to extract data from receipt');
  }

  const date = receipt.fields['TransactionDate'];
  const merchant = receipt.fields['MerchantName'];
  const amount = receipt.fields['Total'];

  return {
    merchant: merchant ? merchant.value : '',
    date: date ? date.value : new Date(),
    amount: amount ? amount.value : undefined
  };
}

module.exports = {
  recognize
};