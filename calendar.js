import {google} from 'googleapis';

function getClient(){
    return new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URL
      )

}

 function getAuthUrl(state) {
    return getClient().generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/calendar',
        ],
        state
      })
  }

 function getToken(code,cb){
    getClient().getToken(code,cb)
}

 function refreshToken(token){
    let client = getClient();
    client.setCredentials(token)
    return new Promise((resolve, reject) => {
      client.refreshAccessToken((err,token)=> {
        if(err) reject(err)
        resolve(token);
      })
    })
}
//   console.log(authUrl)

async function createEvent(token, data){
    let client = getClient()
    client.setCredentials(token)

    const calendar = google.calendar({version: 'v3', auth: client});
    console.log('------',data)
    let start = new Date(data.date.stringValue);
    console.log('8888888888888888',start);
    let time = new Date(data.time.stringValue);
    start.setHours(time.getHours());
    start.setMinutes(time.getMinutes());
    let end = new Date(+start + 1800000).toISOString()
    console.log('-----------',start);
    console.log('00000000000000000000000000',end);
    // let time = new Date(data.time);
      // start.setHours(time.getHours());
      // start.setMinutes(time.getMinutes());
    await calendar.events.insert({ //inserting an event
      calendarId: "primary",
      resource: {
          summary: data.action.stringValue,
          start: {
              dateTime: start.toISOString()
          },
          end: {
            dateTime:end
          }
      }
    },
    (err,resp)=> {
      console.log(err);
      console.log(resp)
      console.log(token);
    })


}

module.exports ={getAuthUrl, getToken, createEvent, refreshToken}
