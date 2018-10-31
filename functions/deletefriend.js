var friendsFuncs = require("../friends-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        if (event["is-ping"]) context.succeed(true);
        var friendId = event.context.friendId;
        var userId = event.context["authorizer-principal-id"];
        var pm = new Promise((resolve, reject) => {

        friendsFuncs.deleteFriend(userId, friendId,
            function(result) {
                context.succeed(true);
            },
            function(error) {
                callback(error);
            });
        });
        
        await pm;
    }
}