import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// Implement the fileStogare logic
export class TopicsStorage {
    constructor(
        private readonly topicsStorage = process.env.ATTACHMENT_S3_BUCKET,
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4'})
    ) {}
   async getBucketName() {
        return this.topicsStorage;
    }
   async getPresignedUploadURL(bucketName, topicId, urlExpiration) {
        return this.s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: topicId,
            Expires: parseInt(urlExpiration)
        });
    }
}