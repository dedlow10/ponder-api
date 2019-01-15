var decisionsFuncs = require("../decisions-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        var pm = new Promise((resolve, reject) => {
            decisionsFuncs.findDecisionById(event.params.path.id,
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