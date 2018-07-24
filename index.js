import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import {google} from 'googleapis';

  
let app = express();
const server = http.Server(app);

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  )
  
  console.log('open URI:',oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar'
    ]
  }))
  
app.get('/oauthcallback', (req, res) => {
    var user={google:{}};
    var token; 
    oauth2Client.getToken(req.query.code, function (err, token) {
      if (err) return console.error(err.message)
      oauth2Client.setCredentials(token);
      const calendar = google.calendar({version: 'v3', auth: oauth2Client});
      user.google.token = token 
    
      calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        if (events.length) {
          console.log('Upcoming 10 events:');
          events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            console.log(`${start} - ${event.summary}`);
          });
        } else {
          console.log('No upcoming events found.');
        }
      console.log(user)
      console.log('token', token, 'req.query:', req.query) // req.query.state <- meta-data
    //   return user.save()

    })
    res.send('Connected to Google!')
    
  })

})

// const oauth2Client = new google.auth.OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     process.env.REDIRECT_URL
//   )
  
//   console.log('open URI:',oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: [
//       'https://www.googleapis.com/auth/calendar'
//     ]
//   }))
  
// app.get('/oauthcallback', (req, res) => {
//     console.log(req.query)
//     oauth2Client.getToken(req.query.code, (err, token) => {
//       console.log(token)
//       if (err) return callback(err);
//       oauth2Client.setCredentials(token);
//     });
//     console.log(oauth2Client)
//     const calendar = google.calendar({version: 'v3', auth: oauth2Client});
//     calendar.events.list({
//       calendarId: 'primary',
//       timeMin: (new Date()).toISOString(),
//       maxResults: 10,
//       singleEvents: true,
//       orderBy: 'startTime',
//     }, (err, res) => {
//       if (err) return console.log('The API returned an error: ' + err);
//       const events = res.data.items;
//       if (events.length) {
//         console.log('Upcoming 10 events:');
//         events.map((event, i) => {
//           const start = event.start.dateTime || event.start.date;
//           console.log(`${start} - ${event.summary}`);
//         });
//       } else {
//         console.log('No upcoming events found.');
//       }
//     });
//   })


server.listen(process.env.PORT || 1337);
