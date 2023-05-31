/**
 * Azure Communication Services Email client module
 */

const { EmailClient, KnownEmailSendStatus } = require("@azure/communication-email");

class Email {
  constructor(CONNECTION_STRING) {
    this.client = new EmailClient(CONNECTION_STRING);
  }

  async send(from, to, subject, body) {
    const POLLER_WAITMS = 200;
    const EMAIL_TIMEOUT = 15000;

    const email = {
      senderAddress: from,
      recipients: {
        to: [{ address: to }]
      },
      content: {
        subject: subject,
        plainText: body
      }
    };

    const poller = await this.client.beginSend(email);
    if (!poller) throw new Error('Failed to send email.');

    let time = 0;
    while (!poller.isDone()) {
      poller.poll();
      await new Promise(resolve => setTimeout(resolve, POLLER_WAITMS));
      time += POLLER_WAITMS;

      if (time > EMAIL_TIMEOUT) {
        throw new Error('Failed to send email.');
      }
    }

    if (poller.getResult().status === KnownEmailSendStatus.Succeeded) {
      return poller.getResult().id;
    } else {
      throw new Error('Failed to send email. ' + poller.getResult().error);
    }
  }

  static isValidAddress(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  }
}

module.exports = Email;