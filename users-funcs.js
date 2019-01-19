var da = require("data-access");

module.exports = {
    register: function(email, firstName, lastName, screenName, passwordHash, callback) {
        var connection = da.getConnection();
        var sql = 
        "INSERT INTO Users (Email, FirstName, LastName, ScreenName, PasswordHash)" +
        "VALUES ('" + email + "', '" + firstName + "', '" + lastName + "', '" + screenName + "', '" + passwordHash + "')";

        connection.query(sql, function (err, results) {
            if (err) throw err;
            var newId = results.insertId;
            connection.end(function (err) { callback(newId);});
        });
    },
    registerDeviceToken: function(userId, token, callback, errorCallback) {
        var connection = da.getConnection();
        var sql = 
        "UPDATE Users SET DeviceToken=? WHERE userId=" + userId;

        connection.query(sql, [token], function (err, results) {
            if (err) {
                connection.end(function () { errorCallback(err);}); 
            }
            else {
                connection.end(function (err) { callback(true);}); 
            }
        });
    },
    findByEmail: function(email, callback) {
        var connection = da.getConnection();
        var sql = 
        "SELECT * FROM Users Where Email = '" + email + "' LIMIT 1";
        connection.query(sql, function(err, result, fields) {
            if (err) throw err;
            connection.end(function (err) { callback(result[0]);});
        });
    },
    findUsers: function(freeText, userId, callback) {
        freeText+= "%";
        var connection = da.getConnection();
        var sql = 
        "SELECT u.*, f1.InvitedOn IS NOT NULL || f2.InvitedOn IS NOT NULL as IsFriend FROM Users u LEFT JOIN Friends f1 ON u.UserId = f1.InvitedUserId AND f1.InvitedByUserId = " + userId + " LEFT JOIN Friends f2 ON u.UserId = f2.InvitedByUserId AND f2.InvitedUserId = " + userId + " Where (Email like ? OR FirstName like ? OR LastName like ?) AND UserId != " + userId + " ORDER BY Email LIMIT 10"
        connection.query(sql, [freeText, freeText, freeText], function(err, result, fields) {
            if (err) throw err;
            connection.end(function (err) { callback(result);});
        });
    },
    getById: function(id, callback) {
        var connection = da.getConnection();
        var sql = 
        "SELECT * FROM Users Where UserId = '" + id + "' LIMIT 1";
        connection.query(sql, function(err, result, fields) {
            if (err) throw err;
            connection.end(function (err) { callback(result[0]);});
        });
    },
    deleteByEmail: function(email, callback) {
        var connection = da.getConnection();
        var sql = 
        "DELETE FROM Users Where Email = '" + email + "'";
        connection.query(sql, function(err, result, fields) {
            if (err) throw err;
            callback(true);
        });
    },
    updateUser: function(user, callback) {
        var connection = da.getConnection();
        var sql = 
        "UPDATE Users SET ProfilePhotoId=? Where UserId=?";
        connection.query(sql, [user.ProfilePhotoId, user.Id], function(err, result, fields) {
            if (err) throw err;
            callback(true);
        });
    }
};