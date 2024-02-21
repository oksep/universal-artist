import * as qiniu from 'qiniu';

interface Option {
    accessKey: string;
    secretKey: string;
    prefix?: string;
    bucket?: string;
    key?: string;
    domain?: string;
}

export function getPublicDownloadUrl(option: Option, key: string): string {
    const manager = new qiniu.rs.BucketManager(
        new qiniu.auth.digest.Mac(option.secretKey, option.secretKey),
        new qiniu.conf.Config(),
    );

    return manager.publicDownloadUrl(option.domain, key);
}

export function requestBucketList(option: Option, callback: Function) {
    const bucketManager = new qiniu.rs.BucketManager(
        new qiniu.auth.digest.Mac(option.accessKey, option.secretKey),
        new qiniu.conf.Config(),
    );

    const options = {
        prefix: option.prefix,
    };

    bucketManager.listPrefix(option.bucket, options, (err, respBody, respInfo) => {
        if (err) {
            console.warn(err);
            callback(err, null);
        }

        if (respInfo != null && respInfo.statusCode === 200) {
            callback(null, {
                nextMarker: respBody.marker,
                items: respBody.items,
            });
        } else {
            console.log(respBody);
            callback(new Error(`code: ${respInfo? respInfo.statusCode : -1}, msg: ${respBody}`), null);
        }
    });
}

export function requestUploadToken(option: Option) {
    const mac = new qiniu.auth.digest.Mac(option.accessKey, option.secretKey);
    const policyOptions = {
        scope: `${option.bucket}:${option.key}`,
        saveKey: option.key,
    };
    console.log('Get token', policyOptions);
    const putPolicy = new qiniu.rs.PutPolicy(policyOptions);
    return putPolicy.uploadToken(mac);
}

export function uploadFile(option) {
	const bucketManager = new qiniu.rs.BucketManager(
		new qiniu.auth.digest.Mac(option.accessKey, option.secretKey),
		new qiniu.conf.Config(),
	);
}

export function requestDeleteImage(option: Option, callback) {
	const bucketManager = new qiniu.rs.BucketManager(
		new qiniu.auth.digest.Mac(option.accessKey, option.secretKey),
		new qiniu.conf.Config(),
	);
	bucketManager.delete(option.bucket, option.key, (err, respBody, respInfo) => {
		if (err) {
			console.warn(err);
			callback(err, null);
		}

		if (respInfo != null && respInfo.statusCode === 200) {
			callback(null, respBody);
		} else {
			console.log(respBody);
			callback(new Error(`code: ${respInfo ? respInfo.statusCode : -1}, msg: ${respBody}`), null);
		}
	})
}