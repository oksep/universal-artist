"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qiniu = require("qiniu");
function getPublicDownloadUrl(option, key) {
    const manager = new qiniu.rs.BucketManager(new qiniu.auth.digest.Mac(option.secretKey, option.secretKey), new qiniu.conf.Config());
    const publicBucketDomain = 'http://assets.septenary.cn';
    return manager.publicDownloadUrl(publicBucketDomain, key);
}
exports.getPublicDownloadUrl = getPublicDownloadUrl;
function requestBucketList(option, callback) {
    const bucketManager = new qiniu.rs.BucketManager(new qiniu.auth.digest.Mac(option.accessKey, option.secretKey), new qiniu.conf.Config());
    const options = {
        prefix: option.prefix,
    };
    bucketManager.listPrefix(option.bucket, options, (err, respBody, respInfo) => {
        if (err) {
            console.warn(err);
            callback(err, null);
        }
        if (respInfo.statusCode === 200) {
            callback(null, {
                nextMarker: respBody.marker,
                items: respBody.items,
            });
        }
        else {
            console.log(respInfo.statusCode);
            console.log(respBody);
            callback(new Error(`code: ${respInfo.statusCode}, msg: ${respBody}`), null);
        }
    });
}
exports.requestBucketList = requestBucketList;
function requestUploadToken(option) {
    const mac = new qiniu.auth.digest.Mac(option.accessKey, option.secretKey);
    const policyOptions = {
        scope: option.bucket,
        saveKey: option.key,
    };
    console.log('Get token', policyOptions);
    const putPolicy = new qiniu.rs.PutPolicy(policyOptions);
    return putPolicy.uploadToken(mac);
}
exports.requestUploadToken = requestUploadToken;
//# sourceMappingURL=/Users/renyufeng/Documents/pro_azhong/azimghost/electron/main/qiniu.js.map