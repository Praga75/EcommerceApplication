const _ = require('lodash');
const nodemailer = require('nodemailer');
const config = require('../../config/config');
const fs = require('fs');
const logger = require(global.appRoot + '/app/log');

//Main transporter function for mail triggering
const transportMail = async (templatePath, mailDetails) => {
    try {
        let baseTemplate = fs.readFileSync(templatePath, 'utf8');
        let templateFn = _.template(baseTemplate);
        let templateHTML = templateFn({ mailDetails: mailDetails });
        let transporter = await nodemailer.createTransport(config.mailer);
        // Setup email
        let mailOptions = {
            from: config.mailer.from,
            to: mailDetails.to,
            subject: mailDetails.subject,
            html: templateHTML
        };
        let info = await transporter.sendMail(mailOptions);
        logger.info('Message %s sent: %s', info.messageId + info.response);
        return Promise.resolve(info);
    } catch (error) {
        logger.error('Message has not been sent:', error);
        return Promise.reject(error);
    }
};

const sendMail = async (req) => {
    let templatePath = global.appRoot + "/app/mailer/templates/mailer.template";
    let mailDetails = req.body;
    //Transport your mails
    transportMail(templatePath, mailDetails)
        .then((info) => {
            return Promise.resolve(info);
        })
        .catch((err) => {
            return Promise.reject(err);
        });

};

const passwordReset = async (user) => {
    let templatePath = global.appRoot + "/app/mailer/templates/passwordReset.template";
    let mailDetails = user;
    mailDetails.subject = "Your Password has been reset";
    mailDetails.to = mailDetails.email;
    //Transport your mails
    transportMail(templatePath, mailDetails)
        .then((info) => {
            return Promise.resolve(info);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};



module.exports = { passwordReset, sendMail }
