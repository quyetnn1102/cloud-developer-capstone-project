import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors} from 'middy/middlewares'
import { deleteTopicItem } from '../../businessLogic/topics'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Remove a TOPIC item by id
    const isExist = await deleteTopicItem(event);
    if (!isExist) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'ERROR, Topic not found'
        })
      };
    }    
    return {
      statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    };    
  }
)

handler.use(
  cors({
    credentials: true
  })
)