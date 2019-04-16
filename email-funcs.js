const AWS = require("aws-sdk");

const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
    </head>
    <body>
        <p>Hi,</p>
        <p>...</p>
    </body>
    </html>
`

module.exports = {
    sendRegistrationEmail: function(emailAddress) {
        AWS.config.update({ region: "us-east-1" });

        const params = {
            Destination: {
              ToAddresses: [emailAddress]
            },
            Message: {
              Body: {
                Html: {
                  Charset: "UTF-8",
                  Data: htmlBody
                },
              },
              Subject: {
                Charset: "UTF-8",
                Data: "Welcome to Ponder!"
              }
            },
            Source: "Dan from Ponder <edlowsoftware@gmail.com>"
          };
          
          // Create the promise and SES service object
          const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
          .sendEmail(params)
          .promise();

          // Handle promise's fulfilled/rejected states
          sendPromise
          .then(data => {
              console.log(data.MessageId);
              context.done(null, "Success");
            })
            .catch(err => {
                console.error(err, err.stack);
                context.done(null, "Failed");
            });
    }
}