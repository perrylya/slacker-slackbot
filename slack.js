const { RTMClient, WebClient } = require('@slack/client');
const { createMessageAdapter } = require('@slack/interactive-messages');
var axios = require('axios');
const token = process.env.SLACK_TOKEN;
const dialogflow = require('dialogflow');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const express = require('express')
const bodyParser =require('body-parser')




// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);
const channelId = 'CBVD6FC7L';
var URL= "https://api.dialogflow.com/v1/query?v=20150910"


const projectId = 'newagent-a0c16'; //https://dialogflow.com/docs/agents#settings
const sessionId = 'quickstart-session-id';
const languageCode = 'en-US';
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const web = new WebClient(token)
const slackInteractions = createMessageAdapter(token);
const port = process.env.PORT || 3000;
slackInteractions.start(port).then(() => {
  console.log('server listening on port:' + port);
})

rtm.start();
rtm.on('message', (event) => {
  if(!event.bot_id)return
  web.chat.postMessage({
    Channel: event.channel,
    Text: "",
    "attachments": []
  })

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: event.text,
        languageCode: languageCode,
      },
    },
  };
  if(event.bot_id) return
  sessionClient
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
    if(result.fulfillmentText.includes('Create') && result.fulfillmentText.includes('?')){
      web.chat.postMessage({
        channel: channelId,
        as_user: true,
        'text': result.fulfillmentText,
        'attachments': [
          {
            'fallback': 'Reminder cancelled, please try again if needed',
            'callback_id': 'confirm_event',
            'color': '#3AA3E3',
            'attachment_type': 'default',
            'actions': [
              {
                'name': 'yes',
                'text': 'Yes',
                'type': 'button',
                'value': 'yes'
              },
              {
                'name': 'no',
                'text': 'No',
                'style': 'danger',
                'type': 'button',
                'value': 'No',
                'confirm': {
                  'title': 'Are you sure?',
                  'text': 'You sure you would like to cancel this reminder?',
                  'ok_text': 'Yes',
                  'dismiss_text': 'No'
                }
              }
            ]
          }
        ]
      })
    }
    else{
      if (result.intent) {
        rtm.sendMessage(result.fulfillmentText, channelId);
        console.log(`Intent: ${result.intent.displayName}`);
      } else {
        console.log(`No intent matched.`);
      }
    }
  })
    .catch(err => {
      console.error('ERROR:', err);
    });

  // .catch(resp=> console.log('Error', error))
})
