const nodemailer = require('nodemailer');
const sendEmail = async options => {
  // create transporter
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '2d0d44c7ea5555',
      pass: '********4f15',
    },
  });
  // define email options
  const mailoptions = {
    from: 'Himanshu Verma <vermah@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // actually send email with nodemailer
  await transporter.sendMail(mailoptions);
};

module.exports = { sendEmail };
