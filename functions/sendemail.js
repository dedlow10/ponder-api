var mailHelper = require("../mail-helper");

// console.log(connection);
module.exports = {
    handler: async function(event, context, callback) {
        if (event["is-ping"]) context.succeed(true);
        var pm = new Promise((resolve, reject) => {
            if (event.mailType == "password_reset") {
                mailHelper.sendPaswordResetMail(event.email, event.password, function() {
                    context.succeed(true);
                });
            }
        });
    
        await pm;
    }
};