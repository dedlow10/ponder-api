var usersFuncs = require("../users-funcs");
var mailHelper = require("../users-funcs");
var passwordHash = require('password-hash');

// console.log(connection);
module.exports = {
    handler: async function(event, context, callback) {
        if (event["is-ping"]) context.succeed(true);
        var pm = new Promise((resolve, reject) => {
            var randomstring = Math.random().toString(36).slice(-8);
            var hash = passwordHash.generate(randomstring);
            usersFuncs.resetPassword(event.Email, hash, function(id) {
                mailHelper.sendPaswordResetMail(event.email, randomstring, function() {
                    context.succeed(true);
                });
            });
        });
    
        await pm;
    }
};