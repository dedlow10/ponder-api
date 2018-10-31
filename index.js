var currentMod = require("functions/acceptInvitation");

// console.log(connection);
exports.handler = async (event, context, callback) => {
    await currentMod.handler(event, context, callback)
};