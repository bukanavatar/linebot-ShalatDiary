//Regular Events
import https from 'https';
import fs from 'fs';
import express from 'express';
import {Client, middleware} from '@line/bot-sdk';
import firebase from 'firebase';
//Events
import {follow} from './Events/events_follow';
import {handleLocation, handleText} from './Events/events_message';
import admin from "firebase-admin";
import serviceAccount from "./shalat-diary-b25ad401ff6c";

const app = express();

const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
const CHANNEL_SECRET = process.env.CHANNEL_SECRET;
const config = {
    channelAccessToken: CHANNEL_ACCESS_TOKEN,
    channelSecret: CHANNEL_SECRET,
};
const client = new Client(config);

const configFirebase = {
    apiKey: "AIzaSyCAveXkK3a66orD-6ouTnj7S_FPIS6yQ-I"
};

if (!firebase.apps.length) {
    firebase.initializeApp(configFirebase);
}
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();
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
            return follow(event.replyToken, event.source, client, db);
        case 'message':
            const message = event.message;
            switch (message.type) {
                case 'text':
                    return handleText(message, event.replyToken, event.source, client, db);
                case 'location':
                    return handleLocation(message, event.replyToken, event.source, client, db);
            }
    }
}

const options = {
    key: fs.readFileSync("/etc/letsencrypt/live/bukanavatar.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/bukanavatar.com/fullchain.pem")
};

https.createServer(options, app).listen(1234);