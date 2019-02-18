var decisionsFuncs = require("../decisions-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        var userId = event.context["authorizer-principal-id"];
        var pm = new Promise((resolve, reject) => {
            decisionsFuncs.getTopDecisions(userId, -(event.params.querystring.days || 7),
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