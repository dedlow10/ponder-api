var da = require("data-access");

module.exports = {
    acceptInvitation: function(invitedByUserId, invitedUserId, invitedOn, callback) {
        var connection = da.getConnection();

        var sql = 
        "UPDATE Friends SET AcceptedOn='" + invitedOn + "' WHERE invitedByUserId=" + invitedByUserId  + " AND invitedUserId=" + invitedUserId;

        connection.query(sql, function (err, results) {
            if (err) throw err;
            var newId = results.insertId;
            connection.end(function (err) { callback(newId);});
        });
    },
    addFriend: function(invitedByUserId, invitedUserId, invitedOn, callback) {
        var connection = da.getConnection();

        var sql = 
        "INSERT INTO Friends (InvitedByUserId, InvitedUserId, InvitedOn, AcceptedOn)" +
        "VALUES (" + invitedByUserId + ", " + invitedUserId + ", '" + invitedOn + "', null)";

        connection.query(sql, function (err, results) {
            if (err) throw err;
            var newId = results.insertId;
            connection.end(function (err) { callback(newId);});
        });
    },
    getFriends: function(userId, callback) {
        var connection = da.getConnection();
        var sql = 
        `
        SELECT u.UserId, u.Email, u.FirstName, u.LastName, f.InvitedOn, f.AcceptedOn, u.DeviceToken, u.ScreenName, u.ProfilePhotoId 
        FROM Friends f 
        JOIN Users u 
        ON u.UserId = f.InvitedUserId 
        WHERE f.InvitedByUserId = ? 
        UNION 
        SELECT u.UserId, u.Email, u.FirstName, u.LastName, f.InvitedOn, f.AcceptedOn, u.DeviceToken, u.ScreenName, u.ProfilePhotoId 
        FROM Friends f JOIN Users u ON u.UserId = f.InvitedByUserId 
        WHERE f.InvitedUserId = ? AND f.AcceptedOn IS NOT NULL
        ORDER BY u.Email
        `;
        
        connection.query(sql, [userId, userId], function(err, result, fields) {
            if (err) throw err;
            connection.end(function (err) { callback(result);});
        });
    },
    getFriendInvitations: function(userId, callback) {
        var connection = da.getConnection();
        var sql = 
        "SELECT u.UserId, u.Email, u.FirstName, u.LastName, f.InvitedOn, f.AcceptedOn, u.DeviceToken, u.ScreenName, u.ProfilePhotoId FROM Friends f JOIN Users u ON u.UserId = f.InvitedByUserId WHERE f.InvitedUserId = ? AND f.AcceptedOn IS NULL"
        connection.query(sql, [userId], function(err, result, fields) {
            if (err) throw err;
            connection.end(function (err) { callback(result);});
        });
    },
    deleteFriend: function(userId, friendId, callback) {
        var connection = da.getConnection();
        var sql = 
        "DELETE FROM Friends WHERE (InvitedByUserId=" + userId + " AND InvitedUserId=" + friendId + ") OR (InvitedByUserId=" + friendId + " AND InvitedUserId=" + userId + ")"
        connection.query(sql, [userId, userId], function(err, result, fields) {
            if (err) throw err;
            connection.end(function (err) { callback(result);});
        });
    }
};