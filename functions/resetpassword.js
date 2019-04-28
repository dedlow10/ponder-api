var usersFuncs = require("../users-funcs");
var passwordHash = require('password-hash');

module.exports = {
    handler: async function(event, context, callback) {
        if (event["is-ping"]) context.succeed(true);
        var pm = new Promise((resolve, reject) => {
            var hash = passwordHash.generate(event.password);
            usersFuncs.changePassword(event.email, hash, function(id) {
                context.succeed(true);
            }, function(err) {
                 callback(err);
            });
        });
    
        await pm;
    }
};