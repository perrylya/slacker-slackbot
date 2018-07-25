import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import {google} from 'googleapis';
import User from './models/user'
import {getAuthUrl, getToken, createEvent} from './calendar'
import slack from './slack'

let app = express();
const server = http.Server(app);



app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/slack', (req,res)=>{

    let payload  = JSON.parse(req.body.payload)
    let user = paylaod.user.id
    let data = JSON.parse(payload.actions[0].value) 

    User.findone({slackId: user})
        .then((u) => {
            createEvent(u.googleTokens, data)
        })

    console.log(data,user)
    res.send('Okay')
})


app.get('/oauthcallback', (req, res) => {
    var User={google:{}};
    var token; 
    getToken(req.query.code, function (err, token) {
        let user = new User({
            slackId: req.body.state,
            googleTokens:tokens
        })
      if (err) return console.error(err.message)



    //   oauth2Client.setCredentials(token);
    //   const calendar = google.calendar({version: 'v3', auth: oauth2Client});
    //   User.google.token = token 
    
     
     
})


server.listen(process.env.PORT || 1337);
