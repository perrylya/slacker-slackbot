import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';

let app = express();
const server = http.Server(app);

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

server.listen(process.env.PORT || 3000);
