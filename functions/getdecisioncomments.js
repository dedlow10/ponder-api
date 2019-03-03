var commentsFuncs = require("../comments-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        var userId = event.context["authorizer-principal-id"];
        var rows = Number(event.params.querystring.rows || 20);
        var offset = Number(event.params.querystring.offset || 0);
        var decisionId = event.params.querystring.decisionId;
        var pm = new Promise((resolve, reject) => {
            commentsFuncs.getMostRecentComments(decisionId, offset, rows,
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