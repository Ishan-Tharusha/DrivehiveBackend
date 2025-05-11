import { createTransport } from "nodemailer";

export default async ({ name = '', email, subject, pass = '', url}) => {
  try {
    const transporter = createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    let emailBody = `Hello ${name},\n\nYour account has been created successfully.`;

    if (pass) {
      emailBody += `\n\nHere are your login details:\nUsername: ${email}\nPassword: ${pass}`;
    }

    emailBody += `\n\nPlease verify your account by clicking the link below:\n${url}\n\nBest Regards,\nYour Company Name`;

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: emailBody,
    });
  } catch (error) {
    // Handle the error
    console.error("Error sending email:", error);
  }
};
