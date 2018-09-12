const https = require('https'), fs = require('fs');

const express = require('express');
const middleware = require('@line/bot-sdk').middleware;
const JSONParseError = require('@line/bot-sdk').JSONParseError;
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed;
const Client = require('@line/bot-sdk').Client;

const app = express();
const options = {
    key: fs.readFileSync("/etc/letsencrypt/live/bukanavatar.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/bukanavatar.com/fullchain.pem")
};

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

app.get('/test', (req, res) => {
    res.send("working");
});
function handleEvent(event) {
    switch (event.type) {
        case 'follow':
            return handleFollow(event.replyToken);
        case 'message':
            const message = event.message;
            switch (message.type) {
                case 'text':
                    return handleText(message, event.replyToken, event.source);
            }
    }
}

function handleFollow(replyToken) {
    client.replyMessage(replyToken, {
        type: 'text',
        text: 'Thanks For Following This Account'
    }).catch(err => console.log(err));
}

https.createServer(options, app).listen(1234);