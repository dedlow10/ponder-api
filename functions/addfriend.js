var friendsFuncs = require("../friends-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        if (event["is-ping"]) context.succeed(true);
        var invitedUserId = event.context.invitedUserId;
        var userId = event.context["authorizer-principal-id"];
        var pm = new Promise((resolve, reject) => {

        friendsFuncs.addFriend(userId, invitedUserId, new Date().toISOString(),
            function(result) {
                context.succeed(result);
            },
            function(error) {
                callback(error);
            });
        });
        
        await pm;
    }
}