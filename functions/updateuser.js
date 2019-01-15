var usersFuncs = require("../users-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        if (event["is-ping"]) context.succeed(true);
        var body = event["body-json"]
        var userId = event.context["authorizer-principal-id"];
        var pm = new Promise((resolve, reject) => {
        var user = {
            ProfilePhotoId: body.ProfilePhotoId,
            Id: event.params.path.id,
        }
        usersFuncs.updateUser(user,
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