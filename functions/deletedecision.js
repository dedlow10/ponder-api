var decisionsFuncs = require("../decisions-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        var userId = event.context["authorizer-principal-id"];
        var pm = new Promise((resolve, reject) => {
            decisionsFuncs.findDecisionById(event.params.path.id, function(rsp) {
                if (rsp.CreatedBy == userId) {
                    decisionsFuncs.deleteDecisionById(event.params.path.id, function(result) {
                        context.succeed(true);
                    },
                    function(error) {
                        callback(error);
                    });
                }
            },function(error) {
                callback(error);
            });
        });

        await pm;
    }
}