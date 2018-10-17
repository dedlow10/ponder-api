var votesFuncs = require("../votes-funcs");

module.exports = {
    handler: async function(event, context, callback) {
        var userId = event.context["authorizer-principal-id"];
        var pm = new Promise((resolve, reject) => {
        var decisionVote = {
            DecisionId: event.params.path.id,
            UserId: userId,
            VotedOn: new Date().toISOString(),
            VotedFor: event.params.path.optionNum,
        }
        votesFuncs.vote(decisionVote,
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