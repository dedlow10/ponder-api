var AWS = require('aws-sdk');
var s3 = new AWS.S3();

module.exports = {
    deleteImage(key, callback, errorCallback) {
        let params = {  Bucket: 'ponder-image-uploads', Key: key };
        s3.deleteObject(params, function(err, data) {
            if (err) errorCallback(err);
            else  callback(true);
            });
    },
    deleteProfilePicture(key, callback, errorCallback) {
        let params = {  Bucket: 'ponder-profile-pictures', Key: key };
        s3.deleteObject(params, function(err, data) {
            if (err) errorCallback(err);
            else  callback(true);
            });
    }
}