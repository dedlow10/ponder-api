var da = require("data-access");

module.exports = {
    create: function(decision, callback, errorCallback) {

        var connection = da.getConnection();
        var sql = 
        "INSERT INTO Decisions (Title, Description, CreatedBy, CreatedOn, IsPublic, DaysToPost, NumberOfOptions, OptionsJson)" +
        "VALUES ('" + decision.Title + "', '" + decision.Description + "', " + decision.CreatedBy + ", '" + decision.CreatedOn + "', " + decision.IsPublic + ", " + decision.DaysToPost + ", " + decision.NumberOfOptions + ", '" + decision.OptionsJson + "')";
        
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
    findDecisionsByCreator: function(createdBy, callback, errorCallback) {
        var connection = da.getConnection();
        var sql = 
        "SELECT d.*, (select count(*) from DecisionVotes dv where d.DecisionId = dv.DecisionId ) as Votes FROM Decisions d WHERE CreatedBy=" + createdBy + " ORDER BY CreatedOn desc";
        
        connection.query(sql, function (err, results) {
            if (err) {
                connection.end(function () { errorCallback(err);}); 
            }
            else {
                connection.end(function (err) { callback(results);}); 
            }
        });
    },
    getTopDecisions: function(currentUserId, callback, errorCallback) {
        var connection = da.getConnection();
        var sql = 
        "SELECT d.*, u.Email as CreatedByUserEmail, (select count(*) from DecisionVotes dv where d.DecisionId = dv.DecisionId ) as Votes, ((SELECT Count(*) FROM DecisionVotes dv WHERE dv.DecisionId = d.DecisionId AND dv.UserId = " + currentUserId + ") = 0 && CreatedBy != " + currentUserId + ") as CanVote FROM Decisions d JOIN Users u ON d.CreatedBy = u.UserId ORDER BY Votes desc, CreatedOn desc";
        
        connection.query(sql, function (err, results) {
            if (err) {
                connection.end(function () { errorCallback(err);}); 
            }
            else {
                connection.end(function (err) { callback(results);}); 
            }
        });
    },
    findDecisionById: function(id, callback, errorCallback) {
        var connection = da.getConnection();
        var sql = 
        "SELECT * FROM Decisions WHERE DecisionId=" + id;
        
        connection.query(sql, function (err, results) {
            if (err) {
                connection.end(function () { errorCallback(err);}); 
            }
            else {
                connection.end(function (err) { callback(results[0]);}); 
            }
        });
    },
    deleteDecisionById: function(id, callback, errorCallback) {
        var connection = da.getConnection();
        var sql = 
        "DELETE FROM DecisionVotes WHERE DecisionId = " + id + ";DELETE FROM Decisions WHERE DecisionId=" + id;
        
        connection.query(sql, function (err, results) {
            if (err) {
                connection.end(function () { errorCallback(err);}); 
            }
            else {
                connection.end(function (err) { callback(results);}); 
            }
        });
    },
};