var votesFuncs = require("../votes-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        var pm = new Promise((resolve, reject) => {
            votesFuncs.getVotes(event.params.path.id,
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