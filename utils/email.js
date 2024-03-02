const { htmlToText } = require('html-to-text');
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmltotext = require('html-to-text');
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Himanshu Verma <${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // sendgrid
      return 1;
    } else {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }
  async send(template, subject) {
    // render html based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template.pug}`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );
    // define email options
    const mailoptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmltotext.fromString(html),
    };
    // create a transport and send email
    await this.newTransport().sendMail(mailoptions);
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }
};
