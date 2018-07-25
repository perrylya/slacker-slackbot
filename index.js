import express from 'express';
import axios from 'axios';
const app = express();
import {getAuthUrl, getToken, createEvent} from './calendar';
import User from './models/User';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDB');
  console.log(getAuthUrl);
})

mongoose.connect(process.env.MONGODB_URI)
import "./slack";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/slack', (req,res)=>{

    let payload  = JSON.parse(req.body.payload)
    let user = paylaod.user.id
    let data = JSON.parse(payload.actions[0].value)

    User.findOne({slackId: user})
        .then((u) => {
            createEvent(u.googleTokens, data)
        })

    console.log(data,user)
    res.send('Okay')
})


app.get('/oauthcallback', (req, res) => {
    getToken(req.query.code, function (err, token) {
        let user = new User({
            slackId: req.body.state,
            googleTokens:token
        })
        user.save()
          .then(() => {
            res.send('Received code');
          })


    //   oauth2Client.setCredentials(token);
    //   const calendar = google.calendar({version: 'v3', auth: oauth2Client});
    //   User.google.token = token

  })
})


app.listen(3000);
