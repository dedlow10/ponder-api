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
    },
    delete: function(commentId, userId, callback) {
        var connection = da.getConnection();

        var sql = `
            DELETE FROM Comments
            WHERE CommentId = ? AND CreatedBy = ?
        `;

        connection.query(sql, [commentId, userId], function (err, results) {
            if (err) throw err;
            connection.end(function (err) { callback(result);});
        });
    },
    getMostRecentComments: function(decisionId, offset, rows, callback) {
        var connection = da.getConnection();

        var sql = `
            SELECT c.*, u.ScreenName as CreatedByUserScreenName, u.ProfilePhotoId 
            FROM Comments c
            JOIN Users u 
            ON c.CreatedBy = u.UserId 
            WHERE c.DecisionId = ? AND c.ParentCommentId IS NULL
            ORDER BY c.CreatedOn desc
            LIMIT ?,?
        `;

        connection.query(sql, [decisionId, offset, rows], function (err, results) {
            if (err) throw err;
            connection.end(function (err) { callback(results);});
        });
    }
};