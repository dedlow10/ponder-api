var da = require("data-access");

module.exports = {
    create: function(question, createdBy, createdOn, isPublic, daysToPost, callback, errorCallback) {

        var connection = da.getConnection();
        var sql = 
        "INSERT INTO Decisions (Question, CreatedBy, CreatedOn, IsPublic, DaysToPost)" +
        "VALUES ('" + question + "', " + createdBy + ", '" + createdOn + "', " + isPublic + ", " + daysToPost + ")";
        
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
        "SELECT * FROM Decisions WHERE CreatedBy=" + createdBy + " ORDER BY CreatedOn desc";
        
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