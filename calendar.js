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
    console.log('------',data)
    console.log('11111111111111111111',data.date);
    let DateTime start = new DateTime(data.date)
    let DateTime end = new DateTime(start + 1800000).toISOString()
    console.log('00000000000000000000000000',end);
    console.log('-----------',start);
    // let time = new Date(data.time);
      // start.setHours(time.getHours());
      // start.setMinutes(time.getMinutes());
    console.log('-----------------',start);
    calendar.events.insert({ //inserting an event
      calenderId: 'primary',
      resource: {
          summary: data.summary,
          start: {
              dateTime: start.toISOString()
          },
          end: {
            dateTime:end
          }
      }

    },
    (err,resp)=> {
      console.log(resp)
    })


}

module.exports ={getAuthUrl, getToken, createEvent, refreshToken}
