const nodemailer = require('nodmailer')

// Nodemailer
const sendEmail = async (options) =>{
    // 1) create transporter (service that will send emails like gmail)
const trnsporter = nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
// if secure false port = 587, if secure true port = 465
    secure:true,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD,
    },
});

// 2) Define email options (from, to, subject, content )
const mailOpts= {
    from:'E-shop App <ahmed@gmail.com>',
    to:options.email,
    subject:options.subject,
    text:options.message,
};
// 3)send Email
await transporter.sendEmail(mailOpts);


};

module.exports = sendEmail;