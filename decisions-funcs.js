var da = require("data-access");

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

module.exports = {
    create: function(decision, callback, errorCallback) {

        var connection = da.getConnection();
        var sql = 
        "INSERT INTO Decisions (Title, Description, CreatedBy, CreatedOn, IsPublic, DaysToPost, NumberOfOptions, OptionsJson, ImageId)" +
        "VALUES ('" + decision.Title.replaceAll("'", "''") + "', '" + decision.Description.replaceAll("'", "''") + "', " + decision.CreatedBy + ", '" + decision.CreatedOn + "', " + decision.IsPublic + ", " + decision.DaysToPost + ", " + decision.NumberOfOptions + ", '" + decision.OptionsJson.replaceAll("'", "''") + "', " + (decision.ImageId == null ? null : ("'" + decision.ImageId + "'")) + ")";
        
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
    countDecisionsByUserId: function(id, callback, errorCallback) {
        var connection = da.getConnection();
        var sql = 
        "SELECT count(*) FROM Decisions WHERE CreatedBy=" + id;
        
        connection.query(sql, function (err, results) {
            if (err) {
                connection.end(function () { errorCallback(err);}); 
            }
            else {
                connection.end(function (err) { callback(results[0]["count(*)"]);}); 
            }
        });
    },
    findDecisionsByCreator: function(createdBy, days, callback, errorCallback) {
        var connection = da.getConnection();
        var dateFilter = new Date();
        dateFilter.setDate(dateFilter.getDate() - days);

        var sql = `
            SELECT d.*, (select count(*) from DecisionVotes dv where d.DecisionId = dv.DecisionId ) as Votes 
            FROM Decisions d 
            WHERE CreatedBy = ?
            AND d.CreatedOn > ? 
            ORDER BY CreatedOn desc;
        `;

        connection.query(sql, [createdBy, dateFilter], function (err, results) {
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
        "SELECT d.*, u.ScreenName as CreatedByUserScreenName, u.ProfilePhotoId, (select count(*) from DecisionVotes dv where d.DecisionId = dv.DecisionId ) as Votes, ((SELECT Count(*) FROM DecisionVotes dv WHERE dv.DecisionId = d.DecisionId AND dv.UserId = " + currentUserId + ") = 0 && CreatedBy != " + currentUserId + ") as CanVote FROM Decisions d JOIN Users u ON d.CreatedBy = u.UserId WHERE d.IsPublic = 1 ORDER BY Votes desc, CreatedOn desc";
        
        connection.query(sql, function (err, results) {
            if (err) {
                connection.end(function () { errorCallback(err);}); 
            }
            else {
                connection.end(function (err) { callback(results);}); 
            }
        });
    },
    getFriendsDecisions: function(userId, days, callback, errorCallback) {
        var connection = da.getConnection();
        var dateFilter = new Date();
        dateFilter.setDate(dateFilter.getDate() - days);

        var sql = `
            SELECT d.*, u.ScreenName as CreatedByUserScreenName, u.ProfilePhotoId, (SELECT Count(*) FROM DecisionVotes dv where d.DecisionId = dv.DecisionId) as Votes, ((SELECT Count(*) FROM DecisionVotes dv WHERE dv.DecisionId = d.DecisionId AND dv.UserId=?) = 0) as CanVote 
            FROM Decisions d JOIN Users u ON d.CreatedBy = u.UserId 
            WHERE d.CreatedBy IN (SELECT InvitedByUserId FROM Friends WHERE InvitedUserId=? AND AcceptedOn IS NOT NULL UNION Select InvitedUserId FROM Friends WHERE InvitedByUserId=?) AND
                  d.CreatedOn > ?
            ORDER BY CreatedOn desc
        `;
        connection.query(sql, [userId, userId, userId, dateFilter], function (err, results) {
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
        "SELECT d.*, u.ScreenName as CreatedByUserScreenName, u.ProfilePhotoId, (SELECT Count(*) FROM DecisionVotes dv where d.DecisionId = dv.DecisionId) as Votes FROM Decisions d JOIN Users u ON d.CreatedBy = u.UserId WHERE DecisionId=" + id;
        
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
        "DELETE FROM DecisionVotes WHERE DecisionId=" + id + "; DELETE FROM Decisions WHERE DecisionId=" + id;
        
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