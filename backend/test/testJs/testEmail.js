const Email = require('../../utils/email');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

test();

async function test() {
  const emailConnectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
  const from = process.env.AZURE_SENDER_EMAIL_ADDRESS;
  const to = process.env.TEST_RECIPIENT_EMAIL_ADDRESS;

  if (!emailConnectionString || !from || !to) {
    console.log('❌ Email Test failed: Missing email connection string, sender address, or recipient address.');
    process.exit(1);
  }

  let email;
  try {
    email = new Email(emailConnectionString);
    if (!email) throw new Error('Email not initialized.');
  } catch(err) {
    console.log('❌ Email Test failed: ' + err.message);
    process.exit(1);
  }

  const subject = 'Test Email';
  const body = 'This is the test email body.';

  try {
    await email.send(from, to, subject, body);
  } catch(err) {
    console.log('❌ Email Test failed: ' + err.message);
    process.exit(1);
  }

  const validAddresses = [
    'joe@organization.com',
    'joe.smith@org.com',
    'joe.smith1@domain.com'
  ];

  const invalidAddresses = [
    'joe@organization',
    'joe.smith@org',
    'joe.smith1@domain'
  ];

  for (const address of validAddresses) {
    if (!Email.isValidAddress(address)) {
      console.log('❌ Email Test failed: Valid address not validated.');
      process.exit(1);
    }
  }

  for (const address of invalidAddresses) {
    if (Email.isValidAddress(address)) {
      console.log('❌ Email Test failed: Invalid address validated.');
      process.exit(1);
    }
  }

  console.log('✅ Email module test passed.');
}