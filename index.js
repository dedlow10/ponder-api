var currentMod = require("functions/getvotesfordecision");

// console.log(connection);
exports.handler = async (event, context, callback) => {
    await currentMod.handler(event, context, callback)
};