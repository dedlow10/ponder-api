var da = require("data-access");

module.exports = {
    register: function(email, firstName, lastName, passwordHash, callback) {
        var connection = da.getConnection();
        var sql = 
        "INSERT INTO Users (Email, FirstName, LastName, PasswordHash)" +
        "VALUES ('" + email + "', '" + firstName + "', '" + lastName + "', '" + passwordHash + "')";

        connection.query(sql, function (err, results) {
            if (err) throw err;
            var newId = results.insertId;
            connection.end(function (err) { callback(newId);});
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
    deleteByEmail: function(email, callback) {
        var connection = da.getConnection();
        var sql = 
        "DELETE FROM Users Where Email = '" + email + "'";
        connection.query(sql, function(err, result, fields) {
            if (err) throw err;
            callback(true);
        });
    }
};