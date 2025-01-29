require("dotenv").config();
const nodemailer = require("nodemailer");

export const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: false, 
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
    },
    tls:{
        rejectUnauthorized: true,
    },
});

export const mailerService = {
    sendEmail: async (to: string, subject: string, content: string) => {
        await transporter.sendMail({
            from: `Software <${process.env.MAILER_EMAIL}>`,
            to: to,
            bcc: process.env.MAILER_EMAIL,
            subject: subject,
            html:`
            <html>
                <body>
                    ${content}
                    <br />
                    <p>Software</p>
                    <p>Rua Teste, 10 - Cidade UF</p>
                    <p>email@email.com.br</p>
                    <p>www.dominio.com.br</p>
                </body>
            </html>
            `,
        })
    },    
}