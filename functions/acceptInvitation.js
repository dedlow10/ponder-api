var friendsFuncs = require("../friends-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        if (event["is-ping"]) context.succeed(true);
        var invitedByUserId = event.context.invitedByUserId;
        var userId = event.context["authorizer-principal-id"];
        var pm = new Promise((resolve, reject) => {
            
        friendsFuncs.acceptInvitation(invitedByUserId, userId, new Date().toISOString(),
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