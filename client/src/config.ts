// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'rtica14cmh'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-ilcul6p9.us.auth0.com',
  domain: 'dev-5ts664rb.us.auth0.com',            // Auth0 domain
  clientId: 'FqJckj38SHJv8idR9aBfn4aj4KBxQiAq',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
