'use strict';

//Regular Events
var https = require('https'),
    fs = require('fs');
var express = require('express');
var middleware = require('@line/bot-sdk').middleware;
var Client = require('@line/bot-sdk').Client;
//Events
var FollowEvent = require('./Events/events_follow');
var MessageEvent = require('./Events/events_message');

var app = express();

var CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
var CHANNEL_SECRET = process.env.CHANNEL_SECRET;

var config = {
    channelAccessToken: CHANNEL_ACCESS_TOKEN,
    channelSecret: CHANNEL_SECRET
};
var client = new Client(config);

app.post('/callback', middleware(config), function (req, res) {
    res.writeHead(200);
    Promise.all(req.body.events.map(handleEvent)).then(function (result) {
        res.json(result);
        console.log(result);
    }).catch(function (err) {
        console.log(err);
        res.status(500).end();
    });
});

function handleEvent(event) {
    switch (event.type) {
        case 'follow':
            return FollowEvent(event.replyToken, event.source, client);
        case 'message':
            var message = event.message;
            switch (message.type) {
                case 'text':
                    return MessageEvent.handleText(message, event.replyToken, event.source, client);
            }
    }
}

var options = {
    key: fs.readFileSync("/etc/letsencrypt/live/bukanavatar.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/bukanavatar.com/fullchain.pem")
};

https.createServer(options, app).listen(1234);