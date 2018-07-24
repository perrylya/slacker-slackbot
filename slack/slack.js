const { RTMClient, WebClient } = require('@slack/client');

const token = process.env.SLACK_TOKEN;

// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);
const channelId = 'CBVD6FC7L';
rtm.start();
rtm.on('message', (event) => {
  console.log(`${event.text}`);
  rtm.sendMessage('yeeeeer', channelId)
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
