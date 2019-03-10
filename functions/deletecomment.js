var commentsFuncs = require("../comments-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        if (event["is-ping"]) context.succeed(true);
        var commentId = event.params.path.id;
        var userId = event.context["authorizer-principal-id"];
        var pm = new Promise((resolve, reject) => {

        commentsFuncs.delete(commentId, userId,
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