var da = require("data-access");

module.exports = {
    create: function(comment, callback) {
        var connection = da.getConnection();

        var sql = 
        "INSERT INTO Comments (DecisionId, Body, CreatedBy, CreatedOn, ParentCommentId)" +
        "VALUES (?, ?, ?, ?, ?)";

        connection.query(sql, [comment.DecisionId, comment.Body, comment.CreatedBy, comment.CreatedOn, comment.ParentCommentId], function (err, results) {
            if (err) throw err;
            var newId = results.insertId;
            connection.end(function (err) { callback(newId);});
        });
    }
};