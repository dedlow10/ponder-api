var votesFuncs = require("../votes-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        var pm = new Promise((resolve, reject) => {
            var userId = event.context["authorizer-principal-id"];
            votesFuncs.countVotesByUserId(userId, 
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