var usersFuncs = require("../users-funcs");
var s3Helper = require("../s3-helper");

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
            
            usersFuncs.getById(user.Id, function(rsp) {
                if (rsp.ProfilePhotoId != null) {
                    s3Helper.deleteProfilePicture(rsp.ProfilePhotoId, 
                    function() {
                        usersFuncs.updateUser(user,
                            function(result) {
                                context.succeed(result);
                            },
                            function(error) {
                                callback(error);
                            });
                    }, 
                    function(error) {
                        callback(error);
                    });
                }
                else {
                    usersFuncs.updateUser(user,
                        function(result) {
                            context.succeed(result);
                        },
                        function(error) {
                            callback(error);
                        });
                
                }
            });
        });

        
        await pm;
    }
}