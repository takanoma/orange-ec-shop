const functions = require('firebase-functions');
const sgMail = require("@sendgrid/mail");
exports.sendEmail = functions.https.onCall((data, context) => {
    const { apiKey, sender, to, title, body }  = data;
    const msg = {
        to: to,
        from: sender,
        subject: title,
        text: body
    }
    sgMail.setApiKey(
        apiKey
    );
    try {
        sgMail.send(msg);
        return {
            "msg" : "success"
        };
    } catch(e) {
        throw new Error();
    }
});