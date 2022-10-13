const nodemailer = require('nodemailer');
const sendGrid = require('nodemailer-sendgrid-transport');
const { config } = require('dotenv');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport(
            sendGrid({
                auth: {
                    api_key: config().parsed.EMAIL_SEND_GRID_ID,
                },
            })
        );
    }

    async sendActivationMail(email, link, name) {
        await this.transporter.sendMail({
            from: config().parsed.SMTP_USER,
            to: email,
            subject: 'Change profile',
            html: `
                        <div>
                            <h1>Hello ${name}</h1>
                            <p>To change your profile follow the link</p>
                            <a href="${link}">${link}</a>
                        </div>
                    `,
        });
    }
}

module.exports = new MailService();
