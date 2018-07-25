import dialogflow from 'dialogflow'
const sessionClient = new dialogflow.SessionsClient();
const projectId = "newagent-a0c16";
const sessionId = "quickstart-session-id";
const query = 'Schedule a meeting with Francis';
const languageCode = "en-US";


 export function interpret(slackId, query){
  const sessionPath = sessionClient.sessionPath(projectId, slackId);
  const request = {
    session: sessionPath, //keeps track of which conversation is which, using unique sessionId/slackId
    queryInput: {
      text: {
        text: event.text,
        languageCode: languageCode,
      },
    },
  };
  return sessionClient
    .detectIntent(request)
    //implicitly detect intent trying to trigger / should sent trigger
    .then(responses => {
      console.log('Detected intent');
      const result = responses[0].queryResult;
      console.log(result)
      // if(!result.allRequredParamsPresent){
      //     //call function again
      // }
      console.log(`  Query: ${result.queryText}`);
      console.log(`  Response: ${result.fulfillmentText}`);
      rtm.sendMessage(result.fulfillmentText, channelId)

      if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
        return result;
      } else {
        console.log(`  No intent matched.`);
      }
    })
    .catch(err => {
      console.error('ERROR:', err);
    });

  // .catch(resp=> console.log('Error', error))
  }
