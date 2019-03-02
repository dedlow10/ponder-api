var decisionsFuncs = require("../decisions-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        var pm = new Promise((resolve, reject) => {
            var userId = event.context["authorizer-principal-id"];
            var rows = Number(event.params.querystring.rows || 20);
            var offset = Number(event.params.querystring.offset || 0);
            var days = event.params.querystring.days || 7;
            decisionsFuncs.findDecisionsByCreator(userId, -(days), offset, rows,
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