var usersFuncs = require("../users-funcs");
var passwordHash = require('password-hash');

// console.log(connection);
module.exports = {
    handler: async function(event, context, callback) {
        if (event["is-ping"]) context.succeed(true);
        var pm = new Promise((resolve, reject) => {
            usersFuncs.findByEmail(event.Email, (user) => {
                if (user != null) {
                    callback("Email is taken");
                }
                else {
                    usersFuncs.findByScreenName(event.ScreenName, (user2) => {
                        if (user2 != null) {
                            callback("ScreenName is taken");
                        }
                        else {
                            var hash = passwordHash.generate(event.Password);
                            usersFuncs.register(event.Email, event.FirstName, event.LastName, event.ScreenName, hash, function(id) {
                                context.succeed(id);
                            });
                        }
                    });

                }
            });
        });
    
        await pm;
    }
};