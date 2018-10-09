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