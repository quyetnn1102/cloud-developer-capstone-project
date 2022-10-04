import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TopicItem } from '../models/TopicItem'
import { TopicUpdateItem } from '../models/TopicUpdateItem';

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TopicsAccess')
// TODO: Implement the dataLayer logic
export  class TopicsAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly topicsTable = process.env.TOPICS_TABLE,
        private readonly indexName = process.env.TOPICS_CREATED_AT_INDEX,
        private readonly topicsStorage = process.env.ATTACHMENT_S3_BUCKET
    ) {}
    
    // get all topics items by user
    async getAllTopicItems(userId) {        
        const result = await this.docClient.query({
            TableName: this.topicsTable,
            IndexName: this.indexName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();
  
        return result.Items;
    }

    // get topic items
    async getTopicItem(topicId, userId) {
        const result = await this.docClient.get({
            TableName: this.topicsTable,
            Key: {
                topicId,
                userId
            }
        }).promise();  
        return result.Item;
    }

    // add topic item
    async addTopicItem(topicItem:TopicItem) {
        await this.docClient.put({
            TableName: this.topicsTable,
            Item: topicItem
        }).promise();
    }

    // update topic item
    async updateTopicItem(topicId, userId, updatedTopic:TopicUpdateItem) {
        logger.info("update topicId: " + topicId + " " +userId)
          await this.docClient.update({
              TableName: this.topicsTable,
              Key: {
                topicId,
                  userId
              },
              UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
              ExpressionAttributeValues: {
                  ':n': updatedTopic.name,
                  ':due': updatedTopic.dueDate,
                  ':d': updatedTopic.done
              },
              ExpressionAttributeNames: {
                  '#name': 'name',
                  '#dueDate': 'dueDate',
                  '#done': 'done'
              }
          }).promise();
      }

      // delete topic item
      async deleteTopicItem(topicId, userId) {
        await this.docClient.delete({
            TableName: this.topicsTable,
            Key: {
                topicId,
                userId
            }
        }).promise();
    }

    // update attachment Url
    async updateTopicAttachmentUrl(topicId: string, attachmentUrl: string){
        logger.info('updateTopicAttachmentUrl: ' + topicId +" "+ attachmentUrl)
        await this.docClient.update({
            TableName: this.topicsTable,
            Key: {
                "topicId": topicId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${this.topicsStorage}.s3.amazonaws.com/${attachmentUrl}`
            }
        }).promise();
    }    
}