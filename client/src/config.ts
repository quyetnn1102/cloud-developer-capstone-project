// Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'ozache8sp7'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  //  Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-e2ixyj6o.us.auth0.com',
  domain: 'dev-e2ixyj6o.us.auth0.com',            // Auth0 domain
  clientId: 'aQBpUDZcoeTorthxzNXoWOa9Fitb2H0m',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
