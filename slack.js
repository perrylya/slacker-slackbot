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
const channel = 'CBVD6FC7L'
rtm.start();

rtm.on('message', async (event) => {
  try {
    console.log(event.channel);
    if( event.user === bot_id || !event.user)return;
    let user = await User.findOne({SlackId: event.user})
    console.log('***************',user);
    if (!user){
      console.log('hi');
      return rtm.sendMessage('Please sign in with Google'+getAuthUrl(event.user), event.channel)
    }
    else if(user.googleTokens.expiry_date < Date.now() + 60000){ //check expiry date
      console.log('in here too');
      let token = await refreshToken(user.googleTokens)
      user.googleTokens = token
      await user.save()
      return
    }

    let botResponse = await interpret(event.user, event.text)
    console.log('***************************************',botResponse);
    if(botResponse.intent.displayName === 'welcome'){
      rtm.sendMessage(botResponse.fulfillmentText,event.channel)
      .catch(console.error)
    }
    else if(!botResponse.allRequiredParamsPresent && botResponse.intent.displayName === 'reminder'){
      rtm.sendMessage(botResponse.fulfillmentText,event.channel)
      .catch(console.error)
    }
    else if(botResponse.allRequiredParamsPresent && botResponse.intent.displayName === 'reminder'){
      console.log(botResponse.parameters.fields);
      let {date, action, task, time} = botResponse.parameters.fields
      // let person = invitee.listValue.values[0]
      const data = {date: new Date(date.stringValue), action: action, task: task, date: date, time: time};
      console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&',data);
      web.chat.postMessage({
        channel: event.channel,
          "text": "Hello there",
          "attachments": [
            {
              "text": botResponse.fulfillmentText,
              "fallback": "Request failed. Send in the request again",
              "callback_id": "remindr",
              "color": "#3AA3E3",
              "attachment_type": "default",
              "actions": [
                {
                  "name": "confirm",
                  "text": "Confirm",
                  "type": "button",
                  "value": JSON.stringify(data)
                },
                {
                  "name": "cancel",
                  "text": "cancel",
                  "type": "button",
                  "value": "false"
                }
              ]
            }
          ]
      })
      .then((res) => {
        console.log(res);
        console.log('Message sent: ', res.ts);
      })
      .catch(console.error);
    }
  } catch (e) {
    console.log(e);
  }
})
