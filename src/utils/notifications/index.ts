import nodemailer from 'nodemailer';
import twilio from 'twilio';

const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  await emailTransporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text
  });
}

export async function sendSMS(to: string, message: string): Promise<void> {
  await twilioClient.messages.create({
    body: message,
    to,
    from: process.env.TWILIO_PHONE_NUMBER
  });
} 