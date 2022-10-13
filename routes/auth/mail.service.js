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
            subject: 'Account activation',
            html: `
                        <div>
                            <h1>Hello ${name}</h1>
                            <p>To activate follow the link</p>
                            <a href="${link}">${link}</a>
                        </div>
                    `,
        });
    }

    async sendMessageToRestorePassword(email, name, link) {
        await this.transporter.sendMail({
            from: config().parsed.SMTP_USER,
            to: email,
            subject: 'Restore password',
            html: `
                <div>
                    <h1>Hello ${name}</h1>
                    <p>To recover your password follow the <a href="${link}">link</a></p>
                </div>
            `,
        });
    }

    async sendMessagePasswordChanged(email) {
        await this.transporter.sendMail({
            from: config().parsed.SMTP_USER,
            to: email,
            subject: 'Password changed',
            html: `
                <div>
                    <h1>Password changed</h1>
                    <p>Your password was changed</p>
                </div>
            `,
        });
    }
}

module.exports = new MailService();
