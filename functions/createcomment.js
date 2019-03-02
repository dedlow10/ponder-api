var commentsFuncs = require("../comments-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        if (event["is-ping"]) context.succeed(true);
        var bodyJson = event["body-json"]
        var userId = event.context["authorizer-principal-id"];
        var pm = new Promise((resolve, reject) => {
        var comment = {
            DecisionId: bodyJson.DecisionId,
            Body: bodyJson.Body,
            CreatedBy: userId,
            CreatedOn: new Date().toISOString(),
            ParentCommentId: bodyJson.ParentCommentId
        }
        commentsFuncs.create(comment,
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