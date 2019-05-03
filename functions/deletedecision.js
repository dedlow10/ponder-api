var decisionsFuncs = require("../decisions-funcs");
var s3Helper = require("../s3-helper");


function deleteImagePromise(imageId) {
    return new Promise((resolve, reject) => {
        s3Helper.deleteImage(imageId, function() {
            resolve(true);
        }, function(err) {
            reject(err);
        });
    });
}

function deleteImages(decision) {
    let promises = [];
    let options = JSON.parse(decision.OptionsJson);
    for (let x = 0; x < options.length; x++) {
        let imageId = options[x].ImageId;
        if (imageId != null) {
            promises.push(deleteImagePromise(imageId));
        }
    }

    if (decision.ImageId != null) {
        promises.push(deleteImagePromise(decision.ImageId));
    }

    return Promise.all(promises);
}

module.exports = {
    handler: async function(event, context, callback) {
        var userId = event.context["authorizer-principal-id"];
        var pm = new Promise((resolve, reject) => {
            decisionsFuncs.findDecisionById(event.params.path.id, function(rsp) {
                if (rsp.CreatedBy == userId) {
                    deleteImages(rsp).then(() => {
                        decisionsFuncs.deleteDecisionById(event.params.path.id, function(result) {
                            context.succeed(true);
                        },
                        function(error) {
                            callback(error);
                        });
                    })
                }
            },function(error) {
                callback(error);
            });
        });

        await pm;
    }
}