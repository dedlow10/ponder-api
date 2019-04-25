var aws = require('aws-sdk');
var ses = new aws.SES({
   region: 'us-east-1'
});
const source = "edlowsoftware@gmail.com";

module.exports = {
    sendPaswordResetMail(email, password, callback) {
        const subject = "Your temporary password for Ponder";
        const passwordResetTemplate = `
        <!DOCTYPE html>
        <html>
        <body>
            <p>Here is your new password: ${password}</p>
            <p></p>
            <p>You will be asked to change this password on the next login</p>
            <p></p>
            <p>Sincerely,</p>
            <p>The Ponder software team</p>
        </body>
        </html>
    `;
        var eParams = {
            Destination: {
                ToAddresses: [email]
            },
            Message: {
                Body: {
                    Html: {
                      Charset: "UTF-8",
                      Data: passwordResetTemplate
                    }
                },
                Subject: {
                    Data: subject
                }
            },
            Source: source
        };

        var email = ses.sendEmail(eParams, function(err, data){
            if(err) if (callback) callback(err);
            else {
                if (callback) callback(event);
            }
        });
    }
}