var currentMod = require("functions/createdecision");

// console.log(connection);
exports.handler = async (event, context, callback) => {
    await currentMod.handler(event, context, callback)
};