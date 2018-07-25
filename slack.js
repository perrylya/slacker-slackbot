const { RTMClient, WebClient } = require('@slack/client');
var axios = require('axios');
const token = process.env.SLACK_TOKEN;
const dialogflow = require('dialogflow');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const express = require('express')
const bodyParser =require('body-parser')

const web = new WebClient(token)

// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);
const channelId = 'CBVD6FC7L';
var URL= "https://api.dialogflow.com/v1/query?v=20150910"
const projectId = 'newagent-a0c16'; //https://dialogflow.com/docs/agents#settings
const sessionId = 'quickstart-session-id';
const languageCode = 'en-US';
import interpret from './dialogflow'



// Instantiate a DialogFlow client.
const sessionClient = new dialogflow.SessionsClient();
// Define session path

//wrap whoel thing in Dialogueflow funciton, will keep running
// The text query request.

// Send request and log result


rtm.start();
rtm.on('message', async (event) => {
  if(event.bot_id)return;

  try{
  let user = await User.findOne({slackId: event.user})
  } catch(e){
    console.log(e)
  }
  if (!user){
    return rtm.sendMessage(`Please signin with Google + ${getAuthUrl(event.user)}`, event.channel)
  }else if(user.googleTokens.expiry_date < Date.now() + 60000){ //check expiry date 
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
     
        let {invitee, day} = botResponse.parameters.fields 

        let person = invitee.listValue.values[0]
        let text = `Confirm a meeting with ${person.stringVale} on ${day.stringValue.toDateString()} `
   
        
      
        web.chat.postMessage({
          Channel: event.channel,
          Text: "",
          "attachments": [{}]


        })

      }  


  
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
})



// Need a web client to find a channel where the app can post a message
const web = new WebClient(token);

// Load the current channels list asynchrously
web.channels.list()
.then((res) => {
  // Take any channel for which the bot is a member
  const channel = res.channels.find(c => c.is_member);

  if (channel) {
    console.log(channel.id);
    // We now have a channel ID to post a message in!
    // use the `sendMessage()` method to send a simple string to a channel using the channel ID
    rtm.sendMessage('yeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer', channel.id)
    // Returns a promise that resolves when the message is sent
    .then((msg) => console.log(`Message sent to channel ${channel.name} with ts:${msg.ts}`))
    .catch(console.error);
  } else {
    console.log('This bot does not belong to any channel, invite it to at least one and try again');
  }
});




