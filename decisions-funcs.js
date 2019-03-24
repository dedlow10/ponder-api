var da = require("data-access");

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


module.exports = {
    create: function(decision, callback, errorCallback) {

        var connection = da.getConnection();
        var sql = 
        "INSERT INTO Decisions (Title, Description, CreatedBy, CreatedOn, ShareStatus, DaysToPost, NumberOfOptions, OptionsJson, ImageId)" +
        "VALUES ('" + decision.Title.replaceAll("'", "''") + "', '" + decision.Description.replaceAll("'", "''") + "', " + decision.CreatedBy + ", '" + decision.CreatedOn + "', " + decision.ShareStatus + ", " + decision.DaysToPost + ", " + decision.NumberOfOptions + ", '" + decision.OptionsJson.replaceAll("'", "''") + "', " + (decision.ImageId == null ? null : ("'" + decision.ImageId + "'")) + ")";
        
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
    setSharedWith: function(decisionId, users, callback, errorCallback) {
        var connection = da.getConnection();
        var sql = "INSERT INTO DecisionShares (DecisionId, UserId) Values ";
        for (var x = 0; x < users.length; x++) {
            sql += "(" + decisionId + "," + users[x].UserId + "),";
        }
        sql = sql.replace(/,\s*$/, "");
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
    findDecisionsByCreator: function(createdBy, days, offset, rows, callback, errorCallback) {
        var connection = da.getConnection();
        var dateFilter = new Date().addDays(days);

        var sql = `
            SELECT d.*, (select count(*) from DecisionVotes dv where d.DecisionId = dv.DecisionId) as Votes 
            FROM Decisions d 
            WHERE CreatedBy = ?
            AND d.CreatedOn > ? 
            ORDER BY CreatedOn desc
            LIMIT ?,?
        `;

        connection.query(sql, [createdBy, dateFilter, offset, rows], function (err, results) {
            if (err) {
                connection.end(function () { errorCallback(err);}); 
            }
            else {
                connection.end(function (err) { callback(results);}); 
            }
        });
    },
    getTopDecisions: function(currentUserId, days, offset, rows, callback, errorCallback) {
        var connection = da.getConnection();
        var dateFilter = new Date().addDays(days);
        
        var sql = 
        `
        SELECT d.*, u.ScreenName as CreatedByUserScreenName, u.ProfilePhotoId, (select count(*) from DecisionVotes dv where d.DecisionId = dv.DecisionId ) as Votes, ((SELECT Count(*) FROM DecisionVotes dv WHERE dv.DecisionId = d.DecisionId AND dv.UserId = ?) = 0 && CreatedBy != ?) as CanVote 
        FROM Decisions d JOIN Users u ON d.CreatedBy = u.UserId 
        WHERE d.ShareStatus = 1 
        AND d.CreatedOn > ?
        ORDER BY Votes desc, CreatedOn desc
        LIMIT ?,?
        `;
        
        connection.query(sql, [currentUserId, currentUserId, dateFilter, offset, rows], function (err, results) {
            if (err) {
                connection.end(function () { errorCallback(err);}); 
            }
            else {
                connection.end(function (err) { callback(results);}); 
            }
        });
    },
    getFriendsDecisions: function(userId, days, offset, rows, callback, errorCallback) {
        var connection = da.getConnection();
        var dateFilter = new Date().addDays(days);

        var sql = `
            SELECT d.*, u.ScreenName as CreatedByUserScreenName, u.ProfilePhotoId, (SELECT Count(*) FROM DecisionVotes dv where d.DecisionId = dv.DecisionId) as Votes, ((SELECT Count(*) FROM DecisionVotes dv WHERE dv.DecisionId = d.DecisionId AND dv.UserId=?) = 0) as CanVote 
            FROM Decisions d JOIN Users u ON d.CreatedBy = u.UserId 
            WHERE d.CreatedBy IN (SELECT InvitedByUserId FROM Friends WHERE InvitedUserId=? AND AcceptedOn IS NOT NULL UNION Select InvitedUserId FROM Friends WHERE InvitedByUserId=?) AND
                  d.CreatedOn > ?
            UNION
            SELECT d2.*, u2.ScreenName as CreatedByUserScreenName, u2.ProfilePhotoId, (SELECT Count(*) FROM DecisionVotes dv where d2.DecisionId = dv.DecisionId) as Votes, ((SELECT Count(*) FROM DecisionVotes dv WHERE dv.DecisionId = d2.DecisionId AND dv.UserId=?) = 0) as CanVote 
            FROM Decisions d2 
            JOIN DecisionShares ds 
            ON d2.DecisionId = ds.DecisionId
            JOIN Users u2
            ON u2.UserId = d2.CreatedBy
            WHERE ds.UserId = ?
            ORDER BY CreatedOn desc
            LIMIT ?,?
        `;
        connection.query(sql, [userId, userId, userId, dateFilter, userId, userId, offset, rows], function (err, results) {
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