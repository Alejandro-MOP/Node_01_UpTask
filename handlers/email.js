const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');
const email = require('../config/email');

// let transporter = nodemailer.createTransport({
//     host: emailConfig.host,
//     port: emailConfig.port,
//     auth: {
//       user: emailConfig.user,
//       pass: emailConfig.pass,
//     },
// });

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    },
});

//crear HTML
const generaHTML = (documento, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${documento}.pug`, opciones);
    return juice(html);
}

exports.enviar = async opciones => {
    const html = generaHTML(opciones.documento, opciones);
    const text = htmlToText.fromString(html);

    let info = transporter.sendMail({
        from: '"Up Task" <no-reply@uptask.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        text,
        html
    });

    const enviarMail = util.promisify(transporter.sendMail, transporter);
    return enviarMail.call(transporter, info)
    //transporter.sendMail(info);
}

