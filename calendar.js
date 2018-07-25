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

function createEvent(token, data){
    let client = getClient()
    client.setCredentials(token)

    const calendar = google.calendar({version: 'v3', auth: client});
    console.log(data)

    let start = new Date(data.date)
    let time = new Date(data.time);
      start.setHours(time.getHours());
      start.setMinutes(time.getMinutes());
    calendar.events.insert({ //inserting an event
      calenderId: 'primary',
      resource: {
          summary: data.summary,
          start: {
              dateTime: start.toISOString()
          },
          end: {
            dateTime: new Date(start.getTime() + 1800000).toISOString()
          }
      }

    })
    res.send('Connected to Google!')


}

module.exports ={getAuthUrl, getToken, createEvent, refreshToken}
