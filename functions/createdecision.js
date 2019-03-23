var decisionsFuncs = require("../decisions-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        if (event["is-ping"]) context.succeed(true);
        var body = event["body-json"]
        var userId = event.context["authorizer-principal-id"];
        var pm = new Promise((resolve, reject) => {
        var decision = {
            Title: body.Title,
            Description: body.Description || "",
            CreatedBy: userId,
            CreatedOn: new Date().toISOString(),
            ShareStatus: body.ShareStatus,
            DaysToPost: body.DaysToPost,
            NumberOfOptions: body.NumberOfOptions,
            OptionsJson: body.OptionsJson,
            ImageId: body.ImageId
        }
        decisionsFuncs.create(decision,
            function(result) {
                if (decision.ShareStatus == "2" && decision.SharedWith != null && decision.SharedWith.length > 0) {
                    decisionsFuncs.setSharedWith(result, decision.SharedWith, function() {
                        context.succeed(result);
                    }, function(error) {
                        callback(error);
                    });
                }
                else {
                    context.succeed(result);
                }
                
            },
            function(error) {
                callback(error);
            });
        });
        
        await pm;
    }
}