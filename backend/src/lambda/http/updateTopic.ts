import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors} from 'middy/middlewares'
import { updateTopicItem } from '../../businessLogic/topics'
import { UpdateTopicRequest } from '../../requests/UpdateTopicRequest'
import { createLogger } from '../../utils/logger'

const logger = createLogger('topics');
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {    
    const updatedTopic: UpdateTopicRequest = JSON.parse(event.body)
    // Update a TOPIC item with the provided id using values in the "updatedTopic" object
    const isExisted = await updateTopicItem(event, updatedTopic);
    logger.info("Check existing item: " + isExisted);
    // check wether topic item is existing or not
    if (!isExisted) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'ERROR, Topic not found'
        })
      };
    }
    logger.info("Topic has been updated");
    // then update it
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    }
  })


  handler  
  .use(
    cors({
      credentials: true
    })
  )

