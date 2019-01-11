var da = require("data-access");

module.exports = {
    vote: function(decisionVote, callback, errorCallback) {

        var connection = da.getConnection();
        var sql = 
        "INSERT INTO DecisionVotes (DecisionId, UserId, VotedOn, VotedFor)" +
        "VALUES (" + decisionVote.DecisionId + ", " + decisionVote.UserId + ", '" + decisionVote.VotedOn + "', " + decisionVote.VotedFor + ")";
        
        console.log(sql);
        
        connection.query(sql, function (err, results) {
            if (err) {
                connection.end(function () { errorCallback(err);}); 
            }
            else {
               var newId = results.insertId;
                connection.end(function (err) { callback(newId);}); 
            }
        });
    },
    countVotesByUserId: function(userId, callback, errorCallback) {

        var connection = da.getConnection();
        var sql = 
        "SELECT count(*) FROM DecisionVotes WHERE UserId=" + userId;
        
        connection.query(sql, function (err, results) {
            if (err) {
                connection.end(function () { errorCallback(err);}); 
            }
            else {
                connection.end(function (err) { callback(results[0]["count(*)"]);}); 
            }
        });
    },
    getVotes: function(decisionId, callback, errorCallback) {

        var connection = da.getConnection();
        var sql = 
        "SELECT dv.*, u.Email FROM DecisionVotes dv JOIN Users u ON dv.UserId = u.UserId AND dv.DecisionId=" + decisionId;
        
        connection.query(sql, function (err, results) {
            if (err) {
                connection.end(function () { errorCallback(err);}); 
            }
            else {
                connection.end(function (err) { callback(results);}); 
            }
        });
    }
};