// pages/api/send-email.js
import nodemailer from 'nodemailer'

export default async function handler(req, res) {
    if (req.method !== 'POST')
        return res.status(405).json({ error: 'Method not allowed' })

    const { to, filename, contentBase64 } = req.body
    if (!to || !filename || !contentBase64) {
        return res
            .status(400)
            .json({
                error: 'Missing required fields: to, filename, contentBase64',
            })
    }

    // Create transporter - example with SMTP credentials in env vars
    // .env.local should include SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Boolean(process.env.SMTP_SECURE === 'true'), // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to,
        subject: 'Recommendations PDF',
        text: 'Please find the attached PDF with the recommendations.',
        attachments: [
            {
                filename,
                content: contentBase64,
                encoding: 'base64',
            },
        ],
    }

    try {
        await transporter.sendMail(mailOptions)
        return res.status(200).json({ ok: true })
    } catch (err) {
        console.error('send-email error: ', err)
        return res
            .status(500)
            .json({ error: 'Failed to send email', details: String(err) })
    }
}
