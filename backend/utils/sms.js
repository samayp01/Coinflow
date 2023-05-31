/**
 * Azure Communication Services SMS client module
 */

const { SmsClient } = require('@azure/communication-sms');

class Sms {
  constructor(SMS_CONNECTION_STRING) {
    this.client = new SmsClient(SMS_CONNECTION_STRING);
  }

  async send(from, to, body) {
    const sendResults = await this.client.send({
      from: from,
      to: [to],
      message: body
    });

    if (!sendResults[0].successful) {
      throw new Error('Failed to send SMS message. ', sendResults[0]);
    }

    return sendResults[0];
  }
}