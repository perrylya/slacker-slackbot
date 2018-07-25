const {google} = require('googleapis');

function getClient(){
    return new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URL
      )

} 
export function getAuthUrl(state) {
    return getClient().generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/calendar',  
        ],
        state 
      })
  }
 
export function getToken(code,cb){
    getClient().getToken(code,cb)
}

export function refreshToken(token){
    let client = getClient();
    client.setCredentials(token)
    client.refreshAccessToken((err,token)=> {
        return token; 
    })
}
//   console.log(authUrl)

export function createEvent(){
    let client = getClient()
    client.setCredentials(token)

    const calendar = google.calendar({version: 'v3', auth: client});
    console.log(data)
    
    let start = new Date(data.date)
    let time = new Date(data.time)
    calendar.events.insert({ //inserting an event 
      calenderId: 'primary',
      resource: {
          summary: data.summary,
          start: {
              dateTime:
          },
          end: {}
      }
    
    })
    res.send('Connected to Google!')


}


