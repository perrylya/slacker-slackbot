import express from 'express';
import bodyParser from 'body-parser';
import path from 'path'
let app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('https://www.googleapis.com/calendar/v3/users/me/calendarList', (req, res) => {
  console.log(res)
  res.send('true')
})
//body: defaultReminders[].method, defaultReminders[].minutes, id, notificationSettings.notifications[].method, notificationSettings.notifications[].type

app.listen(process.env.PORT || 8000)
