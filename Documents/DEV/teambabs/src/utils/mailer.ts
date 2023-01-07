const nodemailer = require('nodemailer')

const sendEmail = async (options:any) =>{
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port : 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    } 
    
})

const message: any = {
    from:"testmailee@zohomail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html ? options.html : null,
};

const info = await transporter.sendMail(message);

console.log('Message sent: %s', info.messageId.blue);
};


export default sendEmail