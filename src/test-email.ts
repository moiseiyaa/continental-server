require('dotenv').config();
const { sendEmail } = require('./services/email.service');

sendEmail({
  to: 'recipient@example.com',
  subject: 'Test Email from SendGrid',
  html: '<h1>Hello from Continental Travels!</h1><p>This is a test email.</p>'
}).catch(console.error);