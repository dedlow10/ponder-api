var decisionsFuncs = require("../decisions-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        var body = event["body-json"]
        var userId = event.context["authorizer-principal-id"];
        var pm = new Promise((resolve, reject) => {

        decisionsFuncs.create(body.Question, userId, body.CreatedOn, body.IsPublic, body.DaysToPost, 
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