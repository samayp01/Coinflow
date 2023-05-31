const { generateVerificationCode, constructToken, decodeToken } = require('../../utils/auth');

test();

async function test() {

  for (let i = 0; i < 100; i++) {
    const code = generateVerificationCode();
    if (code.length !== 6 || isNaN(code)) {
      console.log(`❌ Auth Test failed: Generated invalid verification code <${code}>`);
      process.exit(1);
    }
  }

  const TEST_API_KEY = '1234';
  const test_data = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' },
    { id: 3, name: 'John Smith' },
    { id: 4, name: 'Jane Smith' },
  ];

  for (const data of test_data) {
    const token = constructToken(data, TEST_API_KEY);
    const token2 = decodeToken(token, TEST_API_KEY);
    if (!token2.data || token2.data.id !== data.id || token2.data.name !== data.name) {
      console.log(`❌ Auth Test failed: Expected <${JSON.stringify(data)}> but got <${JSON.stringify(token2)}>`);
      process.exit(1);
    }
  }  

  console.log('✅ Auth module tests passed');
}