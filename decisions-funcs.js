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