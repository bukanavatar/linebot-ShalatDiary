//Regular Events
import https from 'https';
import fs from 'fs';
import express from 'express';
import {Client, middleware} from '@line/bot-sdk';
//Events
import FollowEvent from './Events/events_follow';
import {handleText} from './Events/events_message';

const app = express();

const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
const CHANNEL_SECRET = process.env.CHANNEL_SECRET;

const config = {
    channelAccessToken: CHANNEL_ACCESS_TOKEN,
    channelSecret: CHANNEL_SECRET,
};
const client = new Client(config);

app.post('/callback', middleware(config), (req, res) => {
    res.writeHead(200);
    Promise
        .all(req.body.events.map(handleEvent))
        .then(result => {
            res.json(result);
            console.log(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        });
});

function handleEvent(event) {
    switch (event.type) {
        case 'follow':
            return FollowEvent(event.replyToken, event.source, client);
        case 'message':
            const message = event.message;
            switch (message.type) {
                case 'text':
                    return handleText(message, event.replyToken, event.source, client);
            }
    }
}

const options = {
    key: fs.readFileSync("/etc/letsencrypt/live/bukanavatar.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/bukanavatar.com/fullchain.pem")
};

https.createServer(options, app).listen(1234);