var usersFuncs = require("../users-funcs");
var mailHelper = require("../users-funcs");
var passwordHash = require('password-hash');

// console.log(connection);
module.exports = {
    handler: async function(event, context, callback) {
        if (event["is-ping"]) context.succeed(true);
        var pm = new Promise((resolve, reject) => {
            usersFuncs.resetPassword(event.email, event.password, function(id) {
                context.succeed(true);
            });
        });
    
        await pm;
    }
};