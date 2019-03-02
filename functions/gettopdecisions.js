var decisionsFuncs = require("../decisions-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        var userId = event.context["authorizer-principal-id"];
        var perPage = Number(event.params.querystring.perPage || 20);
        var offset = Number(event.params.querystring.offset || 0);
        var days = event.params.querystring.days || 7;
        var pm = new Promise((resolve, reject) => {
            decisionsFuncs.getTopDecisions(userId, -(days), offset, perPage,
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