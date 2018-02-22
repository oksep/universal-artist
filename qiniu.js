const qiniu = require('qiniu');

exports.getPublicDownloadUrl = function (option, key) {
    const bucketManager = new qiniu.rs.BucketManager(
        new qiniu.auth.digest.Mac(option.accessKey, option.secretKey),
        new qiniu.conf.Config()
    );

    const publicBucketDomain = 'http://assets.septenary.cn';

    return bucketManager.publicDownloadUrl(publicBucketDomain, key);
};

exports.requestBucketList = function (option, callback) {
    const bucketManager = new qiniu.rs.BucketManager(
        new qiniu.auth.digest.Mac(option.accessKey, option.secretKey),
        new qiniu.conf.Config()
    );

    // @param options 列举操作的可选参数
    //  prefix    列举的文件前缀
    //  marker    上一次列举返回的位置标记，作为本次列举的起点信息
    //  limit     每次返回的最大列举文件数量
    //  delimiter 指定目录分隔符
    const options = {
        limit: option.limit,
        prefix: option.prefix,
    };
    bucketManager.listPrefix(option.bucket, options, function (err, respBody, respInfo) {
        if (err) {
            console.warn(err);
            callback(err, null);
        }
        if (respInfo.statusCode === 200) {
            callback(null, {
                nextMarker: respBody.marker,
                items: respBody.items
            });
        } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
            callback(new Error(`code: ${respInfo.statusCode}, msg: ${respBody}`), null);
        }
    });
};