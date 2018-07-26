import { RTMClient, WebClient } from '@slack/client';
import { createMessageAdapter } from '@slack/interactive-messages';
import axios from 'axios';
const token = process.env.SLACK_TOKEN;
import interpret from './dialogflow.js';
import User from './models/User.js';
import {getAuthUrl,getToken, createEvent, refreshToken} from './calendar.js'


const web = new WebClient(token)
const rtm = new RTMClient(token);
const bot_id = 'UBWEDHM4P';
rtm.start();

rtm.on('message', async (event) => {
  try {
    console.log(event);
    if( event.user === bot_id || !event.user)return;
    let user = await User.findOne({SlackId: event.user})
    console.log(user);
    if (!user){
      console.log('hi');
      return rtm.sendMessage('Please sign in with Google'+getAuthUrl(event.user), event.channel)
    }
    else if(user.googleTokens.expiry_date < Date.now() + 60000){ //check expiry date
      console.log('in here too');
      let token = refreshToken(user.googleTokens)
      user.googleTokens = token
      await user.save()
      return
    }

    let botResponse = await interpret(event.user, event.text)
    console.log('***************************************',botResponse);
    if(!botResponse.allRequiredParamsPresent){
      console.log('HOLY SHIT');
    // rtm.sendMessage(botResponse.fulfillmentText,event.channel)
    // .catch(console.error)
    }
    else {
      let {date, action, task} = botResponse.parameters.fields
      console.log('00000000000000000000000000000000',botResponse.parameters.fields);
      // let person = invitee.listValue.values[0]
      let text = `Confirm a reminder on ${new Date(date.stringValue).toDateString()} to ${action}`;
      const data = {date: new Date(date.stringValue), action: action, summary: text};
      console.log('hereeeeeeeeeeeeeee');
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
