import nodemailer from 'nodemailer';

const emailTemplate = (orderId: string, userEmail: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { background-color: #f5f5f5; font-family: Arial, sans-serif; color: #333; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
    .header { text-align: center; padding: 15px; background-color: #1d1d1d; color: #ffffff; border-radius: 8px 8px 0 0; }
    .header h2 { margin: 0; font-size: 24px; }
    .content { padding: 20px; }
    .content h1 { font-size: 20px; color: #333; }
    .content p { line-height: 1.6; margin: 10px 0; }
    .content a { color: #007BFF; text-decoration: none; font-weight: bold; }
    .content a:hover { text-decoration: underline; }
    .footer { text-align: center; padding: 10px; background-color: #1d1d1d; color: #ffffff; font-size: 14px; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h2>SINAN SHOP</h2>
    </div>
    <div class="content">
      <p>Dear Customer,</p>
      <p>Thank you for your order!</p>
      <p>Your order ID is: <strong>${orderId}</strong>.</p>
      <p>To manage your order and track its progress, you need to log in to your SINAN SHOP account using the credentials provided below:</p>
      <p><strong>Login URL:</strong> <a href="https://sinangiftcorner.web.app/login" target="_blank">https://sinangiftcorner.web.app/login</a></p>
      <p><strong>Email:</strong> ${userEmail}</p>
      <p><strong>Password:</strong> If you registered using a custom password, use that. Otherwise, use the default password: <strong>user12345</strong>.</p>

       <p>We are processing your order and will notify you once it has been shipped. You can see your order Progress at the link below:</p>
      <p><a href="https://sinangiftcorner.web.app/login" target="_blank">View My Order</a></p>
      <p>If you have any questions or require assistance, feel free to contact our support team.</p>
      <p>Warm regards, <br />The SINAN Team</p>
    </div>
    <div class="footer">
      &copy; 2024 SINAN | All rights reserved.
    </div>
  </div>
</body>
</html>
`;



export const sendEmail = async (userEmail: string, orderId: string) => {
  // Check for required environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Missing email environment variables (EMAIL_USER, EMAIL_PASS)");
    return;
  }

  // Create the email transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // Secure port for Gmail
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Using app password for Gmail
    },
    logger: true, // Enable logging for debugging
    debug: true, // Enable SMTP communication debugging
  });

  try {
    // Verify the SMTP connection
    await transporter.verify();

    // Prepare the email data
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: userEmail, // Recipient address
      subject: "Order Confirmation - Sinan Shop",
      text: `Thank you for your order! Your order ID is ${orderId}.`,
      html: emailTemplate(orderId, userEmail), // Custom email template
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully to ${userEmail}`);
  } catch (error: any) {
    console.error("Error during email sending process:", error.message);
    if (error.response) {
      console.error("SMTP response error:", error.response);
    }
  }
};
