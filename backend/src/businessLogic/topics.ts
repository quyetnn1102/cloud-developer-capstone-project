import 'source-map-support/register';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getUserId } from '../lambda/utils';
import { TopicsAccess } from '../dataLayer/topicsAccess'
import { TopicsStorage } from '../helpers/attachmentUtils';
import { TopicItem } from '../models/TopicItem'
import { CreateTopicRequest } from '../requests/CreateTopicRequest'
import { UpdateTopicRequest } from '../requests/UpdateTopicRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const topicAccess = new TopicsAccess();
const topicsStorage = new TopicsStorage();
const logger = createLogger('topics');
// Topic: Implement businessLogic
// create topic item
export async function createTopicItem(event: APIGatewayProxyEvent, createTopicRequest: CreateTopicRequest): Promise<TopicItem> {
    const topicId = uuid.v4();
    const userId = getUserId(event);
    const createdAt = new Date(Date.now()).toISOString();
    const bucketName = await topicsStorage.getBucketName();

    const topicItem = {
        userId,
        topicId,
        createdAt,
        done: false,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${topicId}`,
        ...createTopicRequest
    };
    logger.info('createTopicItem userId:' + userId + "topicId: " + topicId + " bucketname: " + bucketName );
    await topicAccess.addTopicItem(topicItem);

    return topicItem;
}

// get topic item by topicId
export async function getTopicItem(event: APIGatewayProxyEvent) {
    const topicId = event.pathParameters.topicId;
    const userId = getUserId(event);
    logger.info('getTopicItem userId: ' + userId + " topicId: " + topicId);
    return await topicAccess.getTopicItem(topicId, userId);
}

// get all topic items by userId
export async function getTopicItems(event: APIGatewayProxyEvent) {
    const userId = getUserId(event);
    logger.info('getTopicItems of userId:' + userId);
    return await topicAccess.getAllTopicItems(userId);
}

export async function updateTopicItem(event: APIGatewayProxyEvent,
    updateTopicRequest: UpdateTopicRequest) {
    const topicId = event.pathParameters.topicId;
    const userId = getUserId(event);
    logger.info('updateTopicItem of userId: ' + userId);

    if (!(await topicAccess.getTopicItem(topicId, userId))) {
        return false;
    }
    logger.info('updateTopicItem of userId: ' + userId + " topicId: " + topicId );    
    await topicAccess.updateTopicItem(topicId, userId, updateTopicRequest);
    return true;
}

export async function deleteTopicItem(event: APIGatewayProxyEvent) {
    const topicId = event.pathParameters.topicId;
    const userId = getUserId(event);
    logger.info('topicId: ' + topicId + "userId: "+userId );
    if (!(await topicAccess.getTopicItem(topicId, userId))) {
        return false;
    }
    logger.info('Delete topic  item by topicId: ' + topicId + " userId: " + userId );
    await topicAccess.deleteTopicItem(topicId, userId);

    return true;
}

export async function generateUploadUrl(event: APIGatewayProxyEvent): Promise<string> {
    const bucket = await topicsStorage.getBucketName();
    const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
    const topicId = event.pathParameters.topicId;
    logger.info('generateUploadUrl bucket: ' + bucket + " topicId: " + topicId )
    return await topicsStorage.getPresignedUploadURL(bucket,topicId,urlExpiration);
}
