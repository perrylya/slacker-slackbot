import { RTMClient, WebClient } from '@slack/client';
import { createMessageAdapter } from '@slack/interactive-messages';
import axios from 'axios';
const token = process.env.SLACK_TOKEN;
import interpret from './dialogflow.js';
import User from './models/User.js';
import {getAuthUrl,getToken, createEvent, refreshToken} from './calendar.js'


const web = new WebClient(token)
const rtm = new RTMClient(token);
const channelId = 'CBVD6FC7L';

rtm.start();

rtm.on('message', async (event) => {
  try {
    if(event.bot_id || !event.user)return;

    let user = await User.findOne({slackId: event.user})
    if (!user){
      console.log(User)
      console.log(getAuthUrl);
      console.log(getToken);
      console.log(createEvent)
      console.log(refreshToken);
      console.log(interpret);
      var authenticate = getAuthUrl(event.user);
      console.log(authenticate);
      return rtm.sendMessage('Please sign in with Google'+authenticate, event.channel)
    }
    else if(user.googleTokens.expiry_date < Date.now() + 60000){ //check expiry date
      let token = refreshToken(user.googleTokens)
      user.googleTokens = token
      await user.save()
      return
    }

    let botResponse = await interpret(event.user, event.text)

    if(!botResponse.allRequiredParamsPresent)
    rtm.sendMessage(botResponse.fulfillmentText,event.channel)
    .catch(console.error)
    else {

      let {invitee, day, time} = botResponse.parameters.fields
      let person = invitee.listValue.values[0]
      let text = `Confirm a meeting with ${person.stringVale} on ${new Date(day.stringValue).toDateString()} `;
      const data = {person: person.stringValue, date: new Date(day.stringValue), time: new Date(time.stringValue).toDateString(), summary: text};

      web.chat.postMessage({
        Channel: event.channel,
        Text: "Hello there",
        "attachments": [{
          "text": text,
          "fallback": "Reminder cancelled, please try again.",
          "callack_id": "remindr_event",
          "color": "#3AA3E3",
          "attachment_type": "default",
          "actions": [
            {
              "name": "confirm",
              "text": "confirm",
              "type": "button",
              "value": JSON.stringify(data)
            },
            {
              "name": "cancel",
              "text": "cancel",
              "type": "button",
              "value": "false"
            },
          ]
        }]
      })
      .then((res) => {
        console.log('Message sent: ', res.ts);
      })
      .catch(console.error);
    }
  } catch (e) {
    console.log(e);
  }
})






//check if(botResponse.allRequiredParamsPresent)
// rtm.sendMessage(botResponse.fullfillmentText,event.channel).catch(console.error)
// else {
//rtm.sendMessage("conversation complete", event.channel)
//}




// export function interpret(slackId, query){
// const sessionPath = sessionClient.sessionPath(projectId, sessionId);
// const request = {
//   session: sessionPath, //keeps track of which conversation is which, using unique sessionId/slackId
//   queryInput: {
//     text: {
//       text: event.text,
//       languageCode: languageCode,
//     },
//   },
// };
// sessionClient
//   .detectIntent(request)
//   //implicitly detect intent trying to trigger / should sent trigger
//   .then(responses => {
//     console.log('Detected intent');
//     const result = responses[0].queryResult;
//     console.log(result)
//     // if(!result.allRequredParamsPresent){
//     //     //call function again
//     // }
//     console.log(`  Query: ${result.queryText}`);
//     console.log(`  Response: ${result.fulfillmentText}`);
//     rtm.sendMessage(result.fulfillmentText, channelId)

//     if (result.intent) {
//       console.log(`  Intent: ${result.intent.displayName}`);
//     } else {
//       console.log(`  No intent matched.`);
//     }
//   })
//   .catch(err => {
//     console.error('ERROR:', err);
//   });

// // .catch(resp=> console.log('Error', error))
// }
