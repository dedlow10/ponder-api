var friendsFuncs = require("../friends-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        var userId = event.context["authorizer-principal-id"];
        var text = event.params.querystring.text;
        var pm = new Promise((resolve, reject) => {
            friendsFuncs.getFriends(userId, text,
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