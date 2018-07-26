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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/slack', (req, res) => {
  res.send('here');
})

app.post('/slack', (req, res)=>{
    // res.status(200).send({challenge: req.body.challenge})
    let payload  = JSON.parse(req.body.payload)
    let user = payload.user.id
    let data = JSON.parse(payload.actions[0].value)
    console.log('---------------------------------',user);
    User.findOne({SlackId: user})
        .then((u) => {
            createEvent(u.googleTokens, data)
            console.log('---------------------',data,user)
            res.send('Okay')
        })
})


app.get('/oauthcallback', (req, res) => {
  console.log(req.query);
    getToken(req.query.code, function (err, token) {
      console.log('*********************************',req.query.state);
        let user = new User({
            SlackId: req.query.state,
            googleTokens:token
        })
        user.save()
          .then(() => {
            res.send('Received code');
          })
          .catch((err) =>{
            console.log(err);
          })


    //   oauth2Client.setCredentials(token);
    //   const calendar = google.calendar({version: 'v3', auth: oauth2Client});
    //   User.google.token = token

  })
})


app.listen(3000);
