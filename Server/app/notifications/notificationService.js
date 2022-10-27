const _ = require('lodash');
const config = require(global.appRoot + '/config/config');
const fs = require('fs');
const client = {};

if (config.twilioKeys) {
    client = require('twilio')(config.twilioKeys.accountSid, config.twilioKeys.authToken);
}
if (config.fcm) {
    const fcmadmin = require("firebase-admin");
    fcmadmin.initializeApp({
        credential: fcmadmin.credential.cert(config.fcm),
        databaseURL: config.firebasedb.url
    });
}

// Creates a push notification
const sendNotification = async (msg) => {
    if (msg && msg.topic && (msg.notification || msg.data)) {
        let message = {
            notification: msg.notification || {},
            // data: JSON.stringify(msg.data) || JSON.stringify({"data": "No-data"}),
            topic: msg.topic
        };
        // Send a message to devices subscribed to the provided topic.
        try {
            let info = await fcmadmin.messaging().send(message);
            return Promise.resolve(info);
        } catch (error) {
            return Promise.reject(error);
        }
    } else {
        return Promise.reject("Message For Topic is undefined");
    }
};

// Creates a Text Message notification
const sendSms = async (msg, to) => {
    try {
        let data = await client.api.messages.create({
            body: msg,
            to: to,
            from: config.twilioKeys.sendingNumber,
        });
        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject(error);
    }
};

// Creates a Whatsapp Message notification
const sendWhatsAppmsg = async (msg, to) => {
    try {
        let data = await client.api.messages
            .create({
                body: msg,
                to: 'whatsapp:' + to,
                from: 'whatsapp:' + config.twilioKeys.sendingNumber,
            });
        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject(error);
    }
};


//Mailer and SMS - FCM and Twilio Based
module.exports = { sendNotification, sendWhatsAppmsg, sendSms }
