var friendsFuncs = require("../friends-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        var userId = event.context["authorizer-principal-id"];
        var pm = new Promise((resolve, reject) => {
            friendsFuncs.getFriendInvitations(userId,
            function(results) {
                context.succeed(results);
            }, 
            function(err) {
                callback(err);
            });
        });
   
        await pm;
    }
}