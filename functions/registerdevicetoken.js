var usersFuncs = require("../users-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        if (event["is-ping"]) context.succeed(true);
        var userId = event.context["authorizer-principal-id"];
        var pm = new Promise((resolve, reject) => {
            usersFuncs.registerDeviceToken(userId, event.params.path.token, function(results) {
                context.succeed(results);
            }, 
            function(err) {
                callback(err);
            });
        });
    
        await pm;
    }
};