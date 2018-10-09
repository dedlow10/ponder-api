var usersFuncs = require("../users-funcs");
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
var jwtSecret = "321cookiesricehorsecover123";

module.exports = {
    handler: async function(event, context, callback) {
        var pm = new Promise((resolve, reject) => {
            usersFuncs.findByEmail(event.Email, function(user) {
                var isValid = passwordHash.verify(event.Password, user.PasswordHash);
                if (isValid) {
                    delete user.PasswordHash;
                    var token = jwt.sign({ userId: user.UserId }, jwtSecret);
                    user.Token = token;
                }
                callback(null, isValid ? user : null);
            });
        });
    
        await pm;
    }
};