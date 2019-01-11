var usersFuncs = require("../users-funcs");
var passwordHash = require('password-hash');

// console.log(connection);
module.exports = {
    handler: async function(event, context, callback) {
        if (event["is-ping"]) context.succeed(true);
        var pm = new Promise((resolve, reject) => {
            var hash = passwordHash.generate(event.Password);
            usersFuncs.register(event.Email, event.FirstName, event.LastName, event.ScreenName, hash, function(id) {
                callback(null, id)
            });
        });
    
        await pm;
    }
};