const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    // if secure false port = 587, if secure true port = 465
    // secure:true,
    auth:{
        user:"ahmedarts817@gmail.com",
        pass:"dwjqbnpepzmqzrbw",
    },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(options) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "EShop app <ahmedarts817@gmail.com>", // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body

  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}

// main().catch(console.error);
module.exports = sendEmail