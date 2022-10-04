import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTopicRequest } from '../../requests/CreateTopicRequest'
import { createTopicItem } from '../../businessLogic/topics'
import { createLogger } from '../../utils/logger'

const logger = createLogger('topics');
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTopic: CreateTopicRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TOPIC item
    if(!newTopic.name)
    {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'ERROR: The name is required.'
        })
      };
    }

    const topic = await createTopicItem(event, newTopic);
    logger.info("Topic has been created");
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
  
      body: JSON.stringify({
        item: topic
      })
    };
  })

handler.use(
  cors({
    credentials: true
  })
)
