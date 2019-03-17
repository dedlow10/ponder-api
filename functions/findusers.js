var usersFuncs = require("../users-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        var userId = event.context["authorizer-principal-id"];
        var onlyFriends = event.params.querystring.onlyFriends;
        var pm = new Promise((resolve, reject) => {
            usersFuncs.findUsers(event.context.text, userId, onlyFriends,
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